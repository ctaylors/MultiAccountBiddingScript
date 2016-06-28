# MultiAccountBiddingScript
Source: Frederick Vallaeys - http://www.ppchero.com/advanced-adwords-budget-script/

The script can check budgets at the keyword, ad, ad group, campaign or account level.


# Script Settings

Here are the lines you’ll need to update in the script to make it work:

currentSetting.scope = “Account”;
Enter a value of either: Account, Campaign, Ad Group, Keyword, or Ad
This is the level at which the maximum budget will be enforced.


currentSetting.maxCost = parseFloat(“1”);
Enter a decimal value that represents the maximum cost each item is allowed to have.


currentSetting.budgetPeriod = “Daily”;
Enter a value of either: Daily, Monthly, Weekly Sun-Sat, Weekly Mon-Sun
This is the time frame for the budget, i.e. the period during which the maximum cost can be accrued.


currentSetting.labelName = “Label name to check”;
Enter the name of the label that you’ve added to the items you want the script to check. If you want to check all items of your selected scope (e.g. all keywords), then leave this blank.


currentSetting.labelToAdd = “stopped by budget script”;
Enter the name of the label you want the script to add to all items that exceed the allowed budget. This will make it easy for you to find these items in an account, and it is also needed for the script to know what should be re-enabled at the start of a new period.
 

currentSetting.email = “example@example.com”;
Enter the email address of the person to notify whenever a budget has been exceeded or whenever the script makes any changes to the account.


currentSetting.pauseItems = “yes”;
Enter a value of either: yes, no
This says if the script should pause items that exceeded the budget (yes) or not (no).

 
currentSetting.reEnableItems = “yes”;
Enter a value of either: yes, no
This says if the script should re-enable any items that were paused by the script when a new budget period commences. The script must be set to run hourly for this to work.
