sap.ui.define(
    ["sap/ui/core/UIComponent"], 
    function(UIComponent){
        return UIComponent.extend("ey.sd.sls.Component",{
            metadata: {
                manifest: "json"
            },
            init: function(){
                //instantiate the base class constructor
                UIComponent.prototype.init.apply(this);

                //Step 1 : Get the router object from the parent class
                var oRouter = this.getRouter();
                //Step 2 : Call the initialize function of router
                //         it will scan manifest json file for routing configuration
                oRouter.initialize();
            },
            // createContent: function(){

            //     var oAppView = new sap.ui.view({
            //         id: "idAppView",
            //         viewName: "ey.sd.sls.view.App",
            //         type: "XML"
            //     });

            //     //Step 1: Obtain the object of app container control
            //     var oAppCon = oAppView.byId("idAppCon");

            //     //Step 2: Create objects of our newly created views
            //     var oView1 = new sap.ui.view({
            //         id: "idView1",
            //         viewName: "ey.sd.sls.view.View1",
            //         type: "XML"
            //     });

            //     var oView2 = new sap.ui.view({
            //         id: "idView2",
            //         viewName: "ey.sd.sls.view.View2",
            //         type: "XML"
            //     });

            //     var oEmpty = new sap.ui.view({
            //         id: "idEmpty",
            //         viewName: "ey.sd.sls.view.Empty",
            //         type: "XML"
            //     });

            //     //Step 3: fill the pages aggregation of the view --- no chaining
            //     oAppCon.addMasterPage(oView1);
            //     oAppCon.addDetailPage(oEmpty).addDetailPage(oView2);

            //     ///Question
            //     // #1 - View1 (correct)  #2 - View2   #3 - Both   #4 - Error


            //     return oAppView;

            // },
            destroy: function(){}
        });
});