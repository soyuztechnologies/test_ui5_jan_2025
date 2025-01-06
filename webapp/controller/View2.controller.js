sap.ui.define(
    ["ey/sd/sls/controller/BaseController",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    function(BaseController,MessageBox,MessageToast, Fragment, Filter, FilterOperator){
        return BaseController.extend("ey.sd.sls.controller.View2",{
            oRouter: null,
            onInit: function(){
                //Step 1: get router object
                this.oRouter = this.getOwnerComponent().getRouter();
                //Step 2: register this route
                //We attach the RMH event to a new herculis function, also pass controller object
                //to that function
                this.oRouter.getRoute("spiderman").attachMatched(this.herculis, this);
            },
            oSupplierPopup: null,
            onFilter: function(){
                //we need to create a local variable which is accessible inside the async function
                var that = this;
                //Fragment is a standard SAP UI5 API which has load function to load our fragment
                //we will receive the object of fragment and load it through a promise
                //IF lo_alv IS NOT BOUND
                if(!this.oSupplierPopup){
                    Fragment.load({
                        id:"supplier",
                        fragmentName: "ey.sd.sls.fragments.popup",
                        type: "XML",
                        controller: this
                    })
                    //then is a keyword to indicate promise was fulfilled - fragment loaded
                    //here we have a promise function which gives the object created
                    .then(function(oFragment){
                        //inside the promise function we cannot access global variable 'this'
                        //We have to create a copy of this variable outside the function
                        //that is the objct of current class - controller
                        that.oSupplierPopup = oFragment;
                        //check sdk for SelectDialog control properties
                        that.oSupplierPopup.setTitle("Select Supplier(s)");
                        //Allow access of our model to the fragment
                        //Allowing parasite to access our body parts-immune system
                        that.getView().addDependent(that.oSupplierPopup);
                        //Binding with items (Syntax 4)
                        that.oSupplierPopup.bindAggregation("items",{
                            path: '/supplier',
                            template: new sap.m.StandardListItem({
                                icon:'sap-icon://supplier',
                                title: '{name}',
                                description: '{sinceWhen}'
                            })
                        });
                        that.oSupplierPopup.setMultiSelect(true);
                        that.oSupplierPopup.open();
                    });
                }else{
                    this.oSupplierPopup.open();
                }
                
            },
            oCityPopup: null,
            oField: null,
            onF4Help: function(oEvent){
                //The moment user hit F4 on a field, we will capture the object of that cell field in a
                //global variable
                this.oField = oEvent.getSource();
                var that = this;
                if(!this.oCityPopup){
                    Fragment.load({
                        id:"city",
                        fragmentName: 'ey.sd.sls.fragments.popup',
                        type: "XML",
                        controller: this
                    }).then(function(oFragment){
                        that.oCityPopup = oFragment;
                        that.oCityPopup.setTitle("Choose City");
                        that.getView().addDependent(that.oCityPopup);
                        that.oCityPopup.bindAggregation("items",{
                            path: '/cities',
                            template: new sap.m.StandardListItem({
                                icon:'sap-icon://home',
                                title: '{name}',
                                description: '{state}'
                            })
                        });
                        that.oCityPopup.open();
                    });
                }

                that.oCityPopup.open();
            },           
            onConfirmPopup: function(oEvent) {
                ///Get the id of the popup with which user interacted
                var sId = oEvent.getSource().getId();

                ///Check if the ID contains city
                if(sId.indexOf("city") != -1){
                     //Step 1: get the selected value by user
                    var sVal = oEvent.getParameter("selectedItem").getTitle();
                    //Step 2: Set this value to our input field
                    this.oField.setValue(sVal);
                }else{
                    ///logic for supplier
                    var aSelectedItems = oEvent.getParameter("selectedItems");
                    ///Loop at these items and construct a array filter
                    var aFilter = [];
                    for (let i = 0; i < aSelectedItems.length; i++) {
                        const element = aSelectedItems[i];
                        var sText = element.getTitle();
                        aFilter.push(new Filter("name", FilterOperator.EQ, sText));
                    }
                    var oFilter = new Filter({
                        filters: aFilter,
                        and: false
                    });
                    //Get the table object
                    var oTable = this.getView().byId("idSupplierTab");
                    //Inject the filter in the table
                    oTable.getBinding("items").filter(oFilter);
                }              

                //debugger;
                //MessageToast.show("Yes user click a item");
            },
            herculis : function(oEvent){
                //Step 1: extract the id
                var sIndex = oEvent.getParameter("arguments").fruitId;
                //Step 2: Rebuild the path
                var sPath = "/" + sIndex;
                //Step 3: get the current view object
                var oView2 = this.getView();
                //Step 4: Bind the element
                oView2.bindElement(sPath,{
                    expand: 'To_Supplier'
                });

                //debugger;
            },
            onBack: function(){
                //chaining in JS with same thing done to use parent to nav to view1
                this.getView().getParent().to("idView1");
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