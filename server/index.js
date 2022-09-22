const express = require("express");
const cors = require('cors')
const app = express();
const controller = require("./ai/controller");
const trainer = require("./ai/trainer");
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const data = require('./data/train.json');
const data2 = require('./data/train2.json');
app.use(cors())

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `Train.xlsx`)
    }
  })
let upload = multer({ storage: storage })

app.post('/uploadFile', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file);
  });

app.get('/train', (req, res) => {
    // // convert xlsx to json
    // const result = excelToJson({
    //     source: fs.readFileSync('./uploads/Train.xlsx'),
    //     sheets: ['Bug', 'Test_Issue', 'Envi_Issue'],
    //     columnToKey: {
    //         A: 'error',
    //         B: 'failure_type'
    //     }
    // });
    trainer.trainModel(data)
    .then(function (data) {
        res.end()
    })
    .catch(function (e) {
        res.status(500, {
            error: e
        });
    });
})


const test = [
    "Failed [fail]: (Item SUBWAY TEMPLATE WBS123 cannot be located in combobox div[data-id=''leftSide_ProjectTemplateSource''])", // envi 
    "Failed [fail]: (SelectCellValue - <Projects - Firm Type - Client> not found.)", // test 
    "Failed [fail]: (GetRowWithColumnValue - <auto_PBI1316551_45_6227> not found.)", // bug
    "An error occurred while running .getAttribute() command on <div[data-id=''ReportGroups''] *.grid-spinner>:", // bug
    "Failed [fail]: (Control div[data-id=''POSTINGLOGS''] tr:nth-child(17) button[title = ''Print Report''] does not exist in DOM)", // bug
    "Failed [fail]: (Error: Project Canberra was not successfully created     at Happy Path - Hubs - Projects - Project - Revenue Forecast Changes To Projects - First Lower Level Added - WBS 3 EPSG - Verify Dialogs (D:\azagent\A1\_work\1\s\tests\web\nightwatch\tests\happy\hubs\projects\revenueForecast\HP_HB_PR_PRJ_RFChangesToProjects_FirstLowerLevel_WBS3EPSG.js:175:19)     at Object.<anonymous> (D:\azagent\A1\_work\1\s\tests\web\nightwatch\extension\testCase.js:524:6)     at CommandInstance.runCallback (D:\azagent\A1\_work\1\s\tests\web\node_modules\nightwatch\lib\api\client-commands\perform.js:96:17)     at doneCallback (D:\azagent\A1\_work\1\s\tests\web\node_modules\nightwatch\lib\api\client-commands\perform.js:85:14)     at processTicksAndRejections (internal/process/task_queues.js:79:11))", // test
    "Failed [fail]: (Error: Project Canberra was not successfully created     at Happy Path - Hubs - Projects - Project - Revenue Forecast Changes To Projects - First Lower Level Added - WBS 3 EPSG - Verify Dialogs (D:\azagent\A1\_work\13\s\tests\web\nightwatch\tests\happy\hubs\projects\revenueForecast\HP_HB_PR_PRJ_RFChangesToProjects_FirstLowerLevel_WBS3EPSG.js:175:19)     at Object.<anonymous> (D:\azagent\A1\_work\13\s\tests\web\nightwatch\extension\testCase.js:520:6)     at CommandInstance.runCallback (D:\azagent\A1\_work\13\s\tests\web\node_modules\nightwatch\lib\api\client-commands\perform.js:96:17)     at doneCallback (D:\azagent\A1\_work\13\s\tests\web\node_modules\nightwatch\lib\api\client-commands\perform.js:85:14)     at processTicksAndRejections (internal/process/task_queues.js:79:11))", // test
    'Selector [div[data-id="PR.SiblingWBS1"]] is now in quick edit mode - expected "found" but got: "not found"', // test
    'Timed out while waiting for element <div[class="tab-header"]> to be present for 180000 milliseconds. - expected "visible" but got: "not found"', //envi
    'Timed out while waiting for element <form[id*="projectDetails"] div[class*="x-titlebar-right"] div[id*="ext-deltekbutton"]> to be visible for 180000 milliseconds. - expected "visible" but got: "not visible"', // envi
    'Timed out while waiting for element <input[name=companyQuery]> to be present for 180000 milliseconds. - expected "visible" but got: "not found"', // bug
    'Timed out while waiting for element <td.nav-ddwn-td div.dropdown-field-container> to be present for 180000 milliseconds. - expected "found" but got: "not found"', //bug
    'An error occurred while running .getAttribute() command on <div.no-results>:', // envi
    'Expected element <div[data-category-id="All Dashboards"] div.app-item:nth-child(2)> text to equal: "Dashboard_1277659" - expected "equal "Dashboard_1277659" but got: "Labor Cost Analysis 66"', //envi
    'An error occurred while running .click() command on <div[data-id="CR"] table.bodyTable tr:nth-child(1) td[name = "RemittanceSentDate"]>:', // test
    'An error occurred while running .click() command on <Element [name=@addEditView_mainScreen_CancelBtn]>:', //test
    // test
    'Element "detailsView_mainScreen_EditBtn" was not found in "roles". Available elements: detailsView_accessRightsTab_FunctionalAreaCmbbox,' +
    'detailsView_accessRightsTab_FullAccessToAllApplicationTabChkbox, detailsView_accessRightsTab_TabsForThisRoleGrd, detailsView_accessRightsTab_CompaniesGrd,'+ 
    'detailsView_accessRightsTab_FullAccessToAllCompaniesChkbox, detailsView_accessRightsTab_UsersGrd, detailsView_accessRightsTab_AssignUsersLnk,' +
    'detailsView_accessRightsTab_UserMaximizeBtn, detailsView_accessRightsTab_UserExportBtn, detailsView_accessRightsTab_UserFilterBtn, ' +
    'detailsView_accessRightsTab_FullAccessToAllDataExportDefinitionsChkbox, detailsView_accessRightsTab_DataExportDefinitionsForThisRoleGrd, '+
    'detailsView_accessRightsTab_DataExportDefinitionsMaximizeBtn, detailsView_accessRightsTab_DataExportDefinitionsExportBtn, '+
    'detailsView_accessRightsTab_DataExportDefinitionsFilterBtn, detailsView_accessRightsTab_DataExportAdministratorChkbox, detailsView_accessRightsTab_FullAccessToAllDataPacksChkbox,'+
    ' detailsView_accessRightsTab_DataPacksForThisRoleGrd, detailsView_accessRightsTab_DataPacksMaximizeBtn, detailsView_accessRightsTab_DataPacksExportBtn, '+
    'detailsView_accessRightsTab_DataPacksFilterBtn, detailsView_accessRightsTab_ReportsFullAccessToAllReportsChkbox, detailsView_accessRightsTab_ReportGrd, '+
    'detailsView_accessRightsTab_AssignReportsLnk, detailsView_accessRightsTab_ReportsFilterBtn, detailsView_accessRightsTab_ReportsFilterFolderCmbbox, '+
    'detailsView_accessRightsTab_ReportsFilterAllColumnsCmbbox, detailsView_accessRightsTab_ReportsFilterAllGroupsCmbbox, detailsView_accessRightsTab_ReportsFilterNameTxtbox, '+
    'detailsView_accessRightsTab_ReportsFilterSetupAccessTxtbox, detailsView_accessRightsTab_ReportsFilterSetColumnAccessTxtbox, detailsView_accessRightsTab_ReportsFilterTypeTxtbox, name, '+
    'detailsView_accountingTab_TransactionTypesGrd, detailsView_accountingTab_TansactionTypeFilterBtn, detailsView_accountingTab_FullAccessToAllTransationTypeChkbox, '+
    'detailsView_accountingTab_AlowHoldChkbox, detailsView_accountingTab_AllowModifyChkbox, detailsView_accountingTab_AllowFinalProcesingChkbox, '+
    'detailsView_accountingTab_AllowInsertChkbox, detailsView_accountingTab_AllowDeleteChkbox, detailsView_accountingTab_AllowInvoiceFileTobeDeltedChkbox, detailsView_accountingTab_AllowWriteOffChkbox, '+
    'detailsView_accountingTab_AllowTransferChkbox, detailsView_accountingTab_AllowEditUploadChkbox, detailsView_accountingTab_AllowFinalProcessingChkbox, '+
    'detailsView_accountingTab_AllowProcessingInClosedPeriodsChkbox, detailsView_accountingTab_AllowProcessingInPriorPeriodsChkBox, '+
    'detailsView_accountingTab_IncludeCostAmountsInSpentAndProfictCalculationsChkBox, detailsView_accountingTab_IncludeBurdenAmountInSpentAndProfictCalculationChkBox, '+
    'detailsView_accountingTab_AllowModificationInConsultantPartnerReviewChkBox, detailsView_accountingTab_LaborCostRatesAmountsQedit, detailsView_accountingTab_LaborBurdenRatesAmountQedit, '+
    'detailsView_accountingTab_AccountsReceivableCommentReviewAccessQedit, detailsView_accountingTab_AccountsReceivableCommentUpdateAccessQedit, detailsView_accountingTab_ProjectBudgetWorksheetQedit, '+
    'detailsView_accountingTab_IncludePaycheckOnRegisterandBankReconcilationChkBox, detailsView_accountingTab_AllowPayrollProcesingInPriorW2QuarterChkBox, detailsView_accountingTab_TransactionTypeFilterCmbbox, detailsView_accountingTab_EnterFilterCmbbox, detailsView_accountingTab_ReportFilterCmbbox, detailsView_accountingTab_PostFilterCmbbox, detailsView_accountingTab_AllowCashReceiptsForOtherCompaniesChkbox, detailsView_accountingTab_AllowReprocessingOfIntercompanyBillingFilesChkbox, detailsView_mainScreen_FindRolesCmbbox, detailsView_mainScreen_RoleNameLbl, detailsView_mainScreen_OtherActionsCmbbox, detailsView_mainScreen_SwitchToListViewBtn, detailsView_mainScreen_SwitchToDetailsViewBtn, detailsView_mainScreen_FilterMenu, detailsView_mainScreen_NewRoleLnk, detailsView_mainScreen_TabHeader, detailsView_mainScreen_CancelBtn, detailsView_mainScreen_SaveBtn, detailsView_', //test
    // test

];

app.get("/api", (req, res) => {
    res.json( {"us": ["a", "b"]})
})
controller.makePrediction(data2)
app.listen(3001, () => { console.log("Server started port 3001") });