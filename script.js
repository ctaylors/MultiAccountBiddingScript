DEBUG = 0;
 

function main() {

  Logger.log("");
  
//var SETTINGS = new Object();
  currentSetting = new Object();
  currentSetting.scope = "Account";	
  currentSetting.maxCost = parseFloat("1");
  currentSetting.budgetPeriod = "Daily";
  currentSetting.labelName = "";
  currentSetting.labelToAdd = "stopped by budget script";
  currentSetting.email = "frederick@optmyzr.com";
  currentSetting.pauseItems = "yes";
  currentSetting.reEnableItems = "yes";
  
  currentSetting.logText = "";
  
  currentSetting.currencyCode = AdWordsApp.currentAccount().getCurrencyCode();
  
  switch(currentSetting.reEnableItems.toLowerCase()) {
    case "no":
      currentSetting.reEnableAtStartOfNewPeriod = 0;
      break;
    case "yes":
      currentSetting.reEnableAtStartOfNewPeriod = 1;
      break;
  }
  
  switch(currentSetting.pauseItems.toLowerCase()) {
    case "no":
      currentSetting.pauseWhenExceeds = 0;
      break;
    case "yes":
      currentSetting.pauseWhenExceeds = 1;
      break;
  }
  
  switch(currentSetting.budgetPeriod) {
	  case "Daily":
	  	//Logger.log("daily");
      currentSetting.dateRange = "TODAY";
	  	break;
	  case "Weekly Sun-Sat":
        //Logger.log("weekly sun");
        currentSetting.dateRange = "THIS_WEEK_SUN_TODAY";
	  	break;
      case "Weekly Mon-Sun":
        //Logger.log("weekly mon");
        currentSetting.dateRange = "THIS_WEEK_MON_TODAY";
	  	break;
	  case "Monthly":
        //Logger.log("monthly"); 
	  	currentSetting.dateRange = "THIS_MONTH";
        break;
  }
  
  
    
  var thenAction = "Pause"; // Alert
  var condition1 = "Cost > " + currentSetting.maxCost;
  var labelCondition = "Status = ENABLED";
  if(currentSetting.labelName) {
    labelCondition = "LabelNames CONTAINS_ANY ['" + currentSetting.labelName + "']";
  }
  if(DEBUG == 1) Logger.log("labelCondition: " + labelCondition);

  currentSetting.enabledCounter = 0;
  currentSetting.deletedCounter = 0;
  currentSetting.pausedCounter = 0;
  currentSetting.enabledList = new Array();
  currentSetting.pausedList = new Array();
  currentSetting.deletedList = new Array();
  
  
  // Set up labels
  var labelToAddText = currentSetting.labelToAdd + " (" + currentSetting.budgetPeriod + ")";
  Logger.log("labelToAddText: " + labelToAddText);
  currentSetting.labelToAdd = labelToAddText;
  if(currentSetting.labelToAdd) {
    createLabel(currentSetting.labelToAdd, "This label is used by an account automation. Its name should not be changed.");
  }
  
  
  if(currentSetting.reEnableAtStartOfNewPeriod) {
    // Check current date, day and time
    currentSetting.thisAccountTime = getTimeInThisAccount();
    var currentHour = currentSetting.thisAccountTime.HH;
    //Logger.log("currentHour: " + currentHour);
    var dayOfWeek = currentSetting.thisAccountTime.dayOfWeek;
    //Logger.log("dayOfWeek: " + dayOfWeek);
    var dd = currentSetting.thisAccountTime.dd;
    //Logger.log("dd: " + dd);
    
    //Re-activate paused items when start of a new period
    var pluralText = "";
    if(currentSetting.budgetPeriod.toLowerCase().indexOf("daily") != -1) {
      if(currentHour == 0) {
        reEnable();
        var emailType = "Notification";
        var body = 'Resetting daily budgets';
        if(currentSetting.enabledList.length > 0) {
          body += "<br/>";
          body += "Re-Enabled Because We Started a New Daily Budget Period:<br/><ul>";
          
          for(var itemCounter = 0; itemCounter < currentSetting.enabledList.length; itemCounter++) {
            var item = currentSetting.enabledList[itemCounter];
            body += "<li>" + item + "</li>";
          }
          body += "</ul>";
        }
        sendEmailNotifications(currentSetting.email, "Daily Budgets Reset", body, emailType );
        if(currentSetting.enabledList.length > 1) pluralText = "s";
        currentSetting.logText += currentSetting.enabledList.length + " " + currentSetting.scope + pluralText + " enabled. ";
      }
    } else if(currentSetting.budgetPeriod.toLowerCase().indexOf("weekly sun-mon") != -1) {
      if(dayOfWeek == 7 && currentHour == 0) {
        reEnable();
        var emailType = "Notification";
        var body = 'Resetting weekly budgets<br/>';
        if(currentSetting.enabledList.length > 0) {
          body += "<br/>";
          body += "Re-Enabled Because We Started a New Weekly Budget Period:<br/><ul>";
          
          for(var itemCounter = 0; itemCounter < currentSetting.enabledList.length; itemCounter++) {
            var item = currentSetting.enabledList[itemCounter];
            body += "<li>" + item + "</li>";;
          }
          body += "</ul>";
        }
        sendEmailNotifications(currentSetting.email, "Weekly Budgets Reset", body, emailType );
        if(currentSetting.enabledList.length > 1) pluralText = "s";
        currentSetting.logText += currentSetting.enabledList.length + " " + currentSetting.scope + pluralText + " enabled. ";
      }
    } else if(currentSetting.budgetPeriod.toLowerCase().indexOf("weekly mon-sun") != -1) {
      if(dayOfWeek == 1 && currentHour == 0) {
        reEnable();
        var emailType = "Notification";
        var body = 'Resetting weekly budgets<br/>';
        if(currentSetting.enabledList.length > 0) {
          body += "<br/>";
          body += "Re-Enabled Because We Started a New Weekly Budget Period:<br/><ul>";
          
          for(var itemCounter = 0; itemCounter < currentSetting.enabledList.length; itemCounter++) {
            var item = currentSetting.enabledList[itemCounter];
            body += "<li>" + item + "</li>";;
          }
          body += "</ul>";
        }
        sendEmailNotifications(currentSetting.email, "Weekly Budgets Reset", body, emailType );
        if(currentSetting.enabledList.length > 1) pluralText = "s";
        currentSetting.logText += currentSetting.enabledList.length + " " + currentSetting.scope + pluralText + " enabled. ";
      }
    } else if(currentSetting.budgetPeriod.toLowerCase().indexOf("monthly") != -1) {
      if(dd == 1 && currentHour == 0) {
        reEnable();
        var emailType = "Notification";
        var body = 'Resetting monthly budgets on the ' + dd + 'st of the month at ' + currentHour + "h<br/>";
        if(currentSetting.enabledList.length > 0) {
          body += "<br/>";
          body += "Re-Enabled Because We Started a New Monthly Budget Period:<br/><ul>";
          
          for(var itemCounter = 0; itemCounter < currentSetting.enabledList.length; itemCounter++) {
            var item = currentSetting.enabledList[itemCounter];
            body += "<li>" + item + "</li>";;
          }
          body += "</ul>";
        }
        sendEmailNotifications(currentSetting.email, "Monthly Budgets Reset", body, emailType );
        if(currentSetting.enabledList.length > 1) pluralText = "s";
        currentSetting.logText += currentSetting.enabledList.length + " " + currentSetting.scope + pluralText + " enabled. ";
      }
    }
  }
  
  // ------------------------------
  // CHECK IF BUDGETS HAVE EXCEEDED
  // ------------------------------
  
  // Account
  if(currentSetting.scope.toLowerCase().indexOf("account") != -1) {
    var fields = "Cost";
    var reportIterator = AdWordsApp.report('SELECT ' + fields +
      ' FROM ACCOUNT_PERFORMANCE_REPORT DURING ' + currentSetting.dateRange).rows();
    
    while(reportIterator.hasNext()) {
    var row = reportIterator.next();
    var cost = parseFloat(row["Cost"]).toFixed(2);
      if(DEBUG == 1) Logger.log("Cost: " + cost + " currentSetting.maxCost: " + currentSetting.maxCost);
    }
    if(cost > currentSetting.maxCost) {
      // check if all campaigns are paused
      var campaignIterator = AdWordsApp.campaigns()
      .withCondition("Status = ENABLED")
      .get();
      
      var numActiveCampaigns = campaignIterator.totalNumEntities();
      
      if(numActiveCampaigns > 0) {
        var body = "The total cost for the account '" + AdWordsApp.currentAccount().getName() + "' (" + AdWordsApp.currentAccount().getCustomerId() + ") was " + currentSetting.currencyCode + " " + cost
                   + " as of the time of this email. The maximum allowed cost is " + currentSetting.currencyCode + " " + currentSetting.maxCost.toFixed(2) + " " + currentSetting.budgetPeriod + "." +
                     "<br/><br/>The account will continue to accrue more cost unless you take action like pausing all campaigns.";
        var emailType = "warning";
        sendEmailNotifications(currentSetting.email, "Account Budget Exceeded", body, emailType );
        //Logger.log("email sent");
        currentSetting.logText = "Account cost of " + currentSetting.currencyCode + " " + cost + " exceeds the maximum " + currentSetting.budgetPeriod + " cost of " + currentSetting.currencyCode + " " + currentSetting.maxCost.toFixed(2);
        
        if(currentSetting.pauseWhenExceeds) {
          while (campaignIterator.hasNext()) {
            var campaign = campaignIterator.next();
            var name = campaign.getName();
            campaign.pause();
            campaign.applyLabel(currentSetting.labelToAdd);
            currentSetting.pausedCounter++;
            currentSetting.pausedList.push(name);
          }
        }
      }
    } else {
      Logger.log("Account cost is currently " + currentSetting.currencyCode + cost + " and this does not exceed the allowed budget for the account.");
    }
  }
  
  // Campaigns
  else if(currentSetting.scope.toLowerCase().indexOf("campaign") != -1) {
    
    if(currentSetting.labelName != "") {
      var isLabelUsed = checkIfLabelIsUsed(currentSetting.scope, currentSetting.labelName);
    } 
    
    
    if(DEBUG == 1) Logger.log(condition1);
    if(DEBUG == 1) Logger.log(labelCondition);
    if(DEBUG == 1) Logger.log(currentSetting.dateRange);
    
    // SEARCH AND DISPLAY CAMPAIGNS
    var iterator = AdWordsApp.campaigns()
    .withCondition(condition1)
    .withCondition("Status = ENABLED")
    .withCondition(labelCondition)
    .forDateRange(currentSetting.dateRange)
    .get();
    
    while(iterator.hasNext()){
      var item = iterator.next();
      var name = item.getName();
      var cost = item.getStatsFor(currentSetting.dateRange).getCost();
      item.applyLabel(currentSetting.labelToAdd);
      Logger.log("Match found: '" + name + "' cost: " + currentSetting.currencyCode + " " + cost);
      if(currentSetting.pauseWhenExceeds) item.pause();
      currentSetting.pausedCounter++;
      currentSetting.pausedList.push(name + " cost: " + currentSetting.currencyCode + " " + cost);
    } 
    
    
    
    if(currentSetting.pausedCounter == 0) {
      Logger.log("No campaigns exceeded their allowed budgets for the budget period.");
    } else {
      //Logger.log("something else");
    }
    
    
  } else
  
    
  // Ad Groups
  if(currentSetting.scope.toLowerCase().indexOf("ad group") != -1) {
    
    if(currentSetting.labelName != "") {
      var isLabelUsed = checkIfLabelIsUsed(currentSetting.scope, currentSetting.labelName);
    } 
    
    // SEARCH AND DISPLAY CAMPAIGNS
    var iterator = AdWordsApp.adGroups()
     .withCondition(condition1)
     .withCondition("Status = ENABLED")
     .withCondition(labelCondition)
     .forDateRange(currentSetting.dateRange)
     .get();
    
    while(iterator.hasNext()){
      var item = iterator.next();
      var name = item.getName();
      var cost = item.getStatsFor(currentSetting.dateRange).getCost();
      var campaignName = item.getCampaign().getName();
      Logger.log("Match found: " + "campaign: '" + campaignName + "' ad group: '" + name + "' cost: " + currentSetting.currencyCode + " " + cost);
      item.applyLabel(currentSetting.labelToAdd);
      if(currentSetting.pauseWhenExceeds) item.pause();
      currentSetting.pausedCounter++;
      currentSetting.pausedList.push("campaign: '" + campaignName + "' ad group: '" + name + "'" + " cost: " + currentSetting.currencyCode + " " + cost);
    } 
    
    
    
    if(currentSetting.pausedCounter == 0) {
      Logger.log("No ad groups exceeded their allowed budgets for the budget period.");
    }
    
    
    // Ads
  } else if(currentSetting.scope.toLowerCase().indexOf("ad text") != -1) {
    
    if(currentSetting.labelName != "") {
      var isLabelUsed = checkIfLabelIsUsed(currentSetting.scope, currentSetting.labelName);
    } 
    
    var adIterator = AdWordsApp.ads()
     .withCondition(condition1)
     .withCondition("Status = ENABLED")
     .withCondition(labelCondition)
     .forDateRange(currentSetting.dateRange)
     .get();
    
    
    while(adIterator.hasNext()) {
      
      var ad = adIterator.next();
      var adHeadline = ad.getHeadline();
      var description1 = ad.getDescription1();
      var description2 = ad.getDescription2();
      var displayUrl = ad.getDisplayUrl();
      var cost = ad.getStatsFor(currentSetting.dateRange).getCost();
      ad.applyLabel(currentSetting.labelToAdd);
      
      Logger.log("Match found: " + adHeadline + " " + description1 + " " + description2 + " " + displayUrl  + " -- cost: " + currentSetting.currencyCode + " " + cost);
      var fullAdText = adHeadline + " " + description1 + " " + description2 + " " + displayUrl;
      if(currentSetting.pauseWhenExceeds) ad.pause();
      currentSetting.pausedCounter++;
      currentSetting.pausedList.push(fullAdText + " -- cost: " + currentSetting.currencyCode + " " + cost);
    } // while(adIterator.hasNext())
    
    if(currentSetting.pausedCounter == 0) {
      Logger.log("No ads exceeded their allowed budgets for the budget period.");
    }
    
    
    // Keywords
  } else if(currentSetting.scope.toLowerCase().indexOf("keyword") != -1) {
    
    if(currentSetting.labelName != "") {
      var isLabelUsed = checkIfLabelIsUsed(currentSetting.scope, currentSetting.labelName);
    } 
    
    var iterator = AdWordsApp.keywords()
     .withCondition(condition1)
     .withCondition("Status = ENABLED")
     .withCondition(labelCondition)
     .forDateRange(currentSetting.dateRange)
     .get();
    
    while(iterator.hasNext()){
      var item = iterator.next();
      var name = item.getText();
      var cost = item.getStatsFor(currentSetting.dateRange).getCost();
      var campaignName = item.getCampaign().getName();
      var adGroupName = item.getAdGroup().getName();
      Logger.log("Match found: " + "campaign: '" + campaignName + "' ad group: '" + adGroupName + "' kw: '" + name + "' cost: " + currentSetting.currencyCode + " " + cost);
      item.applyLabel(currentSetting.labelToAdd);
      if(currentSetting.pauseWhenExceeds) item.pause();
      currentSetting.pausedList.push("campaign: '" + campaignName + "' ad group: '" + adGroupName + "' kw: '" + name + "'" + " cost: " + currentSetting.currencyCode + " " + cost);
      currentSetting.pausedCounter++;
    } // while iterator hasnext
    
    if(currentSetting.pausedCounter == 0) {
      Logger.log("No keywords exceeded their allowed budgets for the budget period.");
    }
    
    
  } // if scope == keyword
  
  
  currentSetting.pausedList.sort();
  if(currentSetting.pausedCounter > 1) {
    var pluralText = "s";
  } else {
    var pluralText = "";
  }
  var body = currentSetting.pausedCounter + " " + currentSetting.scope + pluralText + " exceeded the " + currentSetting.budgetPeriod + " maximum cost of " + currentSetting.currencyCode + " " + currentSetting.maxCost.toFixed(2) + ". ";
  if(currentSetting.pauseWhenExceeds) body += "They were paused by the script.";
  body += "<br/><ul>";
  
  if(DEBUG == 1) Logger.log("currentSetting.email: " + currentSetting.email + " currentSetting.pausedCounter: " + currentSetting.pausedCounter);
  if(currentSetting.email && currentSetting.pausedCounter > 0) {
    
    var changesMadeOrSuggestedText = "suggested";
    if(currentSetting.pauseWhenExceeds) changesMadeOrSuggestedText = "made";
    
    var pausedOrSuggestedText = "exceeded budget";
    if(currentSetting.pauseWhenExceeds) pausedOrSuggestedText = "paused";
    
    var subject = "Automated Rules for " + AdWordsApp.currentAccount().getName() + ": " + currentSetting.pausedCounter + " change" + pluralText + " " + changesMadeOrSuggestedText;
    currentSetting.logText += currentSetting.pausedCounter + " " + currentSetting.scope + pluralText + " " + pausedOrSuggestedText;
    for(var itemCounter = 0; itemCounter < currentSetting.pausedList.length; itemCounter++) {
      var item = currentSetting.pausedList[itemCounter];
      body += "<li>" + item + "</li>";
    }
    body += "</ul><br/>";
    body += "These items were labeled '" + currentSetting.labelToAdd + "' for easy identification.<br/><br/>";
    body += "Thanks for using a free Optmyzr.com script. Try our Enhanced Scripts for AdWords which have several benefits:<ul><li>automatically updated when AdWords changes</li><li>works with MCC or individual accounts</li><li>change settings without touching a single line of code</li></ul>";
    body += "Get a 2 week free trial at <a href='https://www.optmyzr.com?utm_campaign=free_scripts'>optmyzr.com</a>";
    
    
    var emailType = "notification";
    if(DEBUG == 1) Logger.log("sending email...");
    sendEmailNotifications(currentSetting.email, subject, body, emailType )
  }
}

  

  
  function reEnable(){
  // Campaigns or Account
  if(currentSetting.scope.toLowerCase().indexOf("campaign") != -1 || currentSetting.scope.toLowerCase().indexOf("account") != -1) {
    var iterator = AdWordsApp.campaigns()
     .withCondition("LabelNames CONTAINS_ANY ['" + currentSetting.labelToAdd + "']")
     .get();
    
    while(iterator.hasNext()){
      var item = iterator.next();
      var name = item.getName();
      item.removeLabel(currentSetting.labelToAdd)
      Logger.log("Enabling campaign: " + name);
      item.enable();
      currentSetting.enabledCounter++;
      currentSetting.enabledList.push(name); 
    } 
    
    // SHOPPING CAMPAIGNS
    var iterator = AdWordsApp.shoppingCampaigns()
     .withCondition("LabelNames CONTAINS_ANY ['" + currentSetting.labelToAdd + "']")
     .get();
    
    while(iterator.hasNext()){
      var item = iterator.next();
      var name = item.getName();
      item.removeLabel(currentSetting.labelToAdd)
      Logger.log("Enabling campaign: " + name);
      item.enable();
      currentSetting.enabledCounter++;
      currentSetting.enabledList.push(name); 
    } 
    
  } else
  
    
  // Ad Groups
  if(currentSetting.scope.toLowerCase().indexOf("ad group") != -1) {

    var iterator = AdWordsApp.adGroups()
    .withCondition("LabelNames CONTAINS_ANY ['" + currentSetting.labelToAdd + "']")
    .get();
    
    while(iterator.hasNext()){
      var item = iterator.next();
      var name = item.getName();
      var campaignName = item.getCampaign().getName();
      Logger.log("Enabling campaign: '" + campaignName + "' ad group: '" + name + "'");
      item.removeLabel(currentSetting.labelToAdd);
      
      item.enable();
      currentSetting.enabledCounter++;
      currentSetting.enabledList.push("campaign: '" + campaignName + "' ad group: '" + name + "'");
    }
    
    // SHOPPING AD GROUPS
    var iterator = AdWordsApp.shoppingAdGroups()
    .withCondition("LabelNames CONTAINS_ANY ['" + currentSetting.labelToAdd + "']")
    .get();
    
    while(iterator.hasNext()){
      var item = iterator.next();
      var name = item.getName();
      var campaignName = item.getCampaign().getName();
      Logger.log("Enabling campaign: '" + campaignName + "' ad group: '" + name + "'");
      item.removeLabel(currentSetting.labelToAdd);
      
      item.enable();
      currentSetting.enabledCounter++;
      currentSetting.enabledList.push("campaign: '" + campaignName + "' ad group: '" + name + "'");
    }
    
    
    
    
    // Ads
  } else if(currentSetting.scope.toLowerCase().indexOf("ad text") != -1) {
    
    var adIterator = AdWordsApp.ads()
    .withCondition("LabelNames CONTAINS_ANY ['" + currentSetting.labelToAdd + "']")
    .get();
    
    
    while(adIterator.hasNext()) {
      
      var ad = adIterator.next();
      var adHeadline = ad.getHeadline();
      var description1 = ad.getDescription1();
      var description2 = ad.getDescription2();
      var displayUrl = ad.getDisplayUrl();
      ad.removeLabel(currentSetting.labelToAdd);
      
      Logger.log("Enabling ad: " + adHeadline + " " + description1 + " " + description2 + " " + displayUrl);
      var fullAdText = adHeadline + " " + description1 + " " + description2 + " " + displayUrl;
      
      
      ad.enable();
      currentSetting.enabledCounter++;
      currentSetting.enabledList.push(fullAdText);
      
    } // while(adIterator.hasNext())
    
    
    
    // Keywords
  } else if(currentSetting.scope.toLowerCase().indexOf("keyword") != -1) {
    
    var iterator = AdWordsApp.keywords()
    .withCondition("LabelNames CONTAINS_ANY ['" + currentSetting.labelToAdd + "']")
    .get();
     
    
    while(iterator.hasNext()){
      var item = iterator.next();
      var name = item.getText();
      var campaignName = item.getCampaign().getName();
      var adGroupName = item.getAdGroup().getName();
      Logger.log("Enabling campaign: '" + campaignName + "' ad group: '" + adGroupName + "' kw: '" + name + "'");
      item.removeLabel(currentSetting.labelToAdd);
      
      
      item.enable();
      currentSetting.enabledCounter++;
      currentSetting.enabledList.push("campaign: '" + campaignName + "' ad group: '" + adGroupName + "' kw: '" + name + "'");
      
    } // while iterator hasnext
  } // if scope == keyword
}

/* getTimeInThisAccount
// ----------------------
// Deals with getting the current time and date in this account
// using the timezone settings of the account.

// returns all values in currentSetting.thisAccountTime object
*/
function getTimeInThisAccount() {
  var weekday = new Array(7);
  weekday[0]=  "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  
  var timeZone = AdWordsApp.currentAccount().getTimeZone();
  //Logger.log("time zone: " + timeZone);
  var date = new Date();
  
  var thisAccountTime = new Object();
  thisAccountTime.dayOfWeek = parseInt(Utilities.formatDate(date, timeZone, "uu"));
  thisAccountTime.dd =parseInt(Utilities.formatDate(date, timeZone, "dd"));
  thisAccountTime.weekday = weekday[thisAccountTime.dayOfWeek];
  thisAccountTime.HH = parseInt(Utilities.formatDate(date, timeZone, "HH"));
  thisAccountTime.timeZone = timeZone;
  
  
  return(thisAccountTime);
}

/* createLabel(name, description, backgroundColor)
// ------------
// Makes sure the label doesn't already exists before creating it
// 
*/
function createLabel(name, description, backgroundColor) {
    
    var labelIterator = AdWordsApp.labels()
     .withCondition("Name CONTAINS '" + name + "'")
     .get();
    
    if(labelIterator.hasNext()) {
      Logger.log("Label already exists");
    } else {
      Logger.log("Label needs to be created: " + name + " desc: " + description + " color: " + backgroundColor);
      if(description && backgroundColor) {
        AdWordsApp.createLabel(name, description, backgroundColor);
        Logger.log("Label created");
      } else if (description) {
        AdWordsApp.createLabel(name, description);
        Logger.log("Label created");
      } else {
        AdWordsApp.createLabel(name);
        Logger.log("Label created");
      }
    }
  }	  
  /* checkIfLabelIsUsed(scope, labelName)
// --------------------------------------
// Check is a label that will be used to search for entities is actually used by at
// least 1 of those entities.
//
// This prevents weird cases where the script fails without error due to a missing label
// 
*/
  function checkIfLabelIsUsed(scope, labelName) {
    var entitiesWithLabel = 0;
    var labelIterator = AdWordsApp.labels()
    .withCondition('Name = "' + labelName + '"')
    .get();
    if (labelIterator.hasNext()) {
      var label = labelIterator.next();
      if(scope.toLowerCase().indexOf("campaign") != -1) entitiesWithLabel = label.campaigns().get().totalNumEntities();
      if(scope.toLowerCase().indexOf("ad group") != -1) entitiesWithLabel = label.adGroups().get().totalNumEntities();
      if(scope.toLowerCase().indexOf("ad text") != -1) entitiesWithLabel = label.ads().get().totalNumEntities();
      if(scope.toLowerCase().indexOf("keyword") != -1) entitiesWithLabel = label.keywords().get().totalNumEntities();
      return(entitiesWithLabel);
    }
    
    if(!entitiesWithLabel) {
      Logger.log("No campaigns use the label '" + currentSetting.labelName + "' so this script won't do anything. Update your settings on optmyzr.com with the name of a label that is used for at least 1 campaign.");
    } 
  }
  
  /*
  // emailType can be: notification or warning
  */
  function sendEmailNotifications(emailAddresses, subject, body, emailType ) {
	
    if(emailType.toLowerCase().indexOf("warning") != -1) {
      var finalSubject = "[Warning] " + subject + " - " + AdWordsApp.currentAccount().getName() + " (" + AdWordsApp.currentAccount().getCustomerId() + ")"
    } else if(emailType.toLowerCase().indexOf("notification") != -1) {
      var finalSubject = "[Notification] " + subject + " - " + AdWordsApp.currentAccount().getName() + " (" + AdWordsApp.currentAccount().getCustomerId() + ")"
    }
    
    if(AdWordsApp.getExecutionInfo().isPreview()) {
      var finalBody = "<b>This script ran in preview mode. No changes were made to your account.</b><br/>" + body;
    } else {
      var finalBody = body;
    }
    
	MailApp.sendEmail({
        to:emailAddresses, 
        subject:  finalSubject,
        htmlBody: finalBody
      });
    
    if(DEBUG == 1) Logger.log("email sent to " + emailAddresses + ": " + finalSubject);

  }
