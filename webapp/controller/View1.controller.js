sap.ui.define(
    ["ey/sd/sls/controller/BaseController",
     "sap/ui/model/Filter",
     "sap/ui/model/FilterOperator",
     "ey/sd/sls/util/formatter"
    ],
    function(BaseController,Filter,FilterOperator, Formatter){
        return BaseController.extend("ey.sd.sls.controller.View1",{
            formatter: Formatter,
            onInit: function(){
                ///Now getting Component object
                this.oRouter = this.getOwnerComponent().getRouter();

            },
            //Created a blank object to hold my router object when we reach to this view
            oRouter: null,
            onNext: function(sPath){
                //the path look like as element path /fruits/3, /fruits/4
                //Extract the id from the path ==> SPLIT text BY '/' INTO itab.
                debugger;
                var sIndex = sPath.split("/")[sPath.split("/").length - 1];
                
                this.oRouter.navTo("spiderman",{
                    fruitId : sIndex
                });
                //Step 1: get the current view object
                //var oView = this.getView();
                //Step 2: get the object of mother from the current view
                //Earlier we were using pages aggregation, getParent was giving us the App Container
                //Now we are having 2 levels - getParent will give section object
                //Again we do get Parent gives me the SplitApp container object
                //var oAppCon = oView.getParent().getParent();
                //Step 3: The container will navigate to next view
                //oAppCon.toDetail("idView2");
            },
            onItemPress: function(oEvent){
                //Step 1: Get the object of the list item = Source Control (List) => Table Row
                var oListItem = oEvent.getParameter("listItem");
                //Step 2: Get the address of the element on which user perform the click
                var sPath = oListItem.getBindingContextPath();
                //Step 3: Get the object of second view = Target Control (View2) ==> SimpleForm
                ///var oView2 = this.getView().getParent().getParent().getDetailPage("idView2");
                //Step 4: Bind the element to View2
                ///oView2.bindElement(sPath);

                //Call the code for navigation
                this.onNext(sPath);
            },
            onDeleteItems: function(oEvent){
                //get the list control
                var oList = this.getView().byId("idList");
                ///Get all the items which are selected
                var aSelected = oList.getSelectedItems();                
                ///Loop at each item and delete
                aSelected.forEach(element => {
                    oList.removeItem(element);
                });
            },
            onItemDelete: function(oEvent){
                ///Get the object of the item
                var oListItemToBeDeleted = oEvent.getParameter("listItem");
                ///Get the source object
                var oList = oEvent.getSource();
                ///Delete the item now
                oList.removeItem(oListItemToBeDeleted);

            },
            onAdd: function(){
                this.oRouter.navTo("add");
            },
            onSearch: function(oEvent){
                //Step 1: get the 'query' parameter - The search query string.
                var sValue = oEvent.getParameter('query');
                //Step 2: Build a filter object - is like a IF condition
                //        IF  op1 (name) OPERATOR (Contains)  op2 (sValue)
                var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains, sValue);
                var oFilter2 = new Filter("taste", FilterOperator.Contains, sValue);
                //Step 3: Create Array
                var aFilter = [oFilter1, oFilter2];
                ////IF condition1 LOGICALOPERATOR condition2 => AND / OR
                var oFilter = new Filter({
                    filters : aFilter,
                    and: false
                });
                //Step 4: Get the binding of all the list item
                var oList = this.getView().byId("idList");
                var oBinding = oList.getBinding("items");
                //Step 5: Push the filter inside the binding
                oBinding.filter(oFilter1);
            }
        });
});