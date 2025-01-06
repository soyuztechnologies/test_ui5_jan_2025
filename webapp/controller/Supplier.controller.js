sap.ui.define(
    ["ey/sd/sls/controller/BaseController",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/routing/History"
    ],
    function(BaseController,MessageBox,MessageToast, Fragment, Filter, FilterOperator, History){
        return BaseController.extend("ey.sd.sls.controller.Supplier",{
            oRouter: null,
            onInit: function(){
                //Step 1: get router object
                this.oRouter = this.getOwnerComponent().getRouter();
                //Step 2: register this route
                //We attach the RMH event to a new herculis function, also pass controller object
                //to that function
                this.oRouter.getRoute("supplier").attachMatched(this.herculis, this);
            },
            herculis : function(oEvent){
                //Step 1: extract the id
                var sIndex = oEvent.getParameter("arguments").suppId;
                //Step 2: Rebuild the path
                var sPath = "/supplier/" + sIndex;
                //Step 3: get the current view object
                var oSupplierView = this.getView();
                //Step 4: Bind the element
                oSupplierView.bindElement(sPath);

                //debugger;
            },
            onBack: function(){
                //chaining in JS with same thing done to use parent to nav to view1
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("spiderman", {
                        fruitId: 0
                    }, true);
                }
            },
            onSave: function(){
                //alert("do you want to save");
                MessageBox.confirm("Do you want to save?",{
                    onClose: function(status){
                        if(status === "OK"){
                            MessageToast.show("The Order has been created 👌");
                        }else{
                            MessageBox.error("OOPS!! you broke my heart 💔");
                        }
                    }
                });
            },
            onSupplier: function(oEvent){
                //MessageBox.confirm("This functionality is under construction");
                //Get the selected item done by user
                var oListItem = oEvent.getParameter("listItem");
                ///Extract the address of the same
                var sPath = oListItem.getBindingContextPath();
                ///Extarct the ID
                var sIndex = sPath.split("/")[sPath.split("/").length - 1];

                this.oRouter.navTo("supplier",{
                    suppId: sIndex
                });
            }
        });
});