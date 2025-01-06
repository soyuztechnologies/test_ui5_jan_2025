sap.ui.define(
    [   "ey/sd/sls/controller/BaseController",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController,MessageBox,MessageToast, Fragment, Filter, FilterOperator, JSONModel){
        return BaseController.extend("ey.sd.sls.controller.Add",{
            oRouter: null,
            onInit: function(){
                //Step 1: get router object
                this.oRouter = this.getOwnerComponent().getRouter();
                //Step 2: register this route
                //We attach the RMH event to a new herculis function, also pass controller object
                //to that function
                this.oRouter.getRoute("add").attachMatched(this.herculis, this);
                //a global variable of local model, 2-way binding with view to build payload
                this.oLocalModel = new JSONModel({
                    "prodData": {
                        "PRODUCT_ID": "",
                        "TYPE_CODE": "PR",
                        "CATEGORY": "Notebooks",
                        "NAME": "",
                        "DESCRIPTION": "",
                        "SUPPLIER_ID": "0100000046",
                        "SUPPLIER_NAME": "SAP",
                        "TAX_TARIF_CODE": "1",
                        "MEASURE_UNIT": "EA",
                        "PRICE": "0.00",
                        "CURRENCY_CODE": "USD",
                        "DIM_UNIT": "CM",
                        "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/PO-2025.jpg"
                    }
                });

                this.getView().setModel(this.oLocalModel,"local");
            },
            herculis : function(oEvent){
                this.setMode("Create");
            },
            onBack: function(){
                //chaining in JS with same thing done to use parent to nav to view1
                this.getView().getParent().to("idView1");
            },
            onClear: function(){
                this.oLocalModel.setProperty("/prodData",{
                    "PRODUCT_ID": "",
                    "TYPE_CODE": "PR",
                    "CATEGORY": "Notebooks",
                    "NAME": "",
                    "DESCRIPTION": "",
                    "SUPPLIER_ID": "0100000046",
                    "SUPPLIER_NAME": "SAP",
                    "TAX_TARIF_CODE": "1",
                    "MEASURE_UNIT": "EA",
                    "PRICE": "0.00",
                    "CURRENCY_CODE": "USD",
                    "DIM_UNIT": "CM",
                    "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/PO-2025.jpg"
                });
                this.setMode("Create");
            },
            productId : null,
            onSubmit: function(oEvent){
                //Step 1: extract the id entered by user in product id field
                var sVal = oEvent.getParameter("value");
                //Step 2: Set the value at global variable so later i can use it somewhere else
                this.productId = sVal;
                //Step 3: Build the path to trigger loading of single record
                //  --->  /ProductSet('HT-1000')
                var sPath = "/ProductSet('" + sVal + "')";
                //Step 4: get odata model object
                var oDataModel = this.getOwnerComponent().getModel();
                //Step 5: Read the single record data using odata GET
                var that = this;
                oDataModel.read(sPath, {
                    success: function(data){
                        //Step 6: handle success call back to set data to local model, switch to Edit mode
                        that.oLocalModel.setProperty("/prodData", data);
                        that.loadImage(data.PRODUCT_ID);
                        that.setMode("Edit");
                    },
                    error: function(oError){
                        //Step 7: handle error callback, just inform user to continue creation
                        MessageToast.show("Please continue creating the new product");
                        that.setMode("Create");
                    }
                });
            },
            getMostExp: function(){
                //Step 1: Get the category
                var cat = this.oLocalModel.getProperty("/prodData/CATEGORY");
                //Step 2: Get odata model object
                var oDataModel = this.getOwnerComponent().getModel();
                //Step 3: Call function import
                var that = this;
                oDataModel.callFunction('/GetMostExpensiveProduct',{
                    urlParameters: {
                        I_CATEGORY : cat
                    },
                    success: function(data){
                        //Step 4: Handle callback and set data to local model
                        that.oLocalModel.setProperty("/prodData",data);
                        that.loadImage(data.PRODUCT_ID);
                    }
                })
                
            },
            loadImage : function(prodId){
                var oImage = this.getView().byId("idProdImg");
                oImage.setSrc("/sap/opu/odata/sap/ZANU_DEC_ODATA_SRV/ProductImgSet('" + prodId + "')/$value")
            },
            mode: "Create",
            setMode: function(sMode){
                if(sMode === "Create"){
                    this.getView().byId("prodId").setEnabled(true);
                    this.getView().byId("idSave").setText("Save");
                    this.getView().byId("idDelete").setEnabled(false);
                }else{
                    this.getView().byId("prodId").setEnabled(false);
                    this.getView().byId("idSave").setText("Update");
                    this.getView().byId("idDelete").setEnabled(true);
                }
                this.mode = sMode;
            },
            oSupplierPopup: null,
            oField: null,
            onF4Help: function(oEvent){
                //The moment user hit F4 on a field, we will capture the object of that cell field in a
                //global variable
                this.oField = oEvent.getSource();
                var that = this;
                if(!this.oSupplierPopup){
                    Fragment.load({
                        id:"city",
                        fragmentName: 'ey.sd.sls.fragments.popup',
                        type: "XML",
                        controller: this
                    }).then(function(oFragment){
                        that.oSupplierPopup = oFragment;
                        that.oSupplierPopup.setTitle("Choose Supplier");
                        that.getView().addDependent(that.oSupplierPopup);
                        that.oSupplierPopup.bindAggregation("items",{
                            path: '/SupplierSet',
                            template: new sap.m.StandardListItem({
                                icon:'sap-icon://supplier',
                                title: '{BP_ID}',
                                description: '{COMPANY_NAME}'
                            })
                        });
                        that.oSupplierPopup.open();
                    });
                }

                that.oSupplierPopup.open();
            },           
            onConfirmPopup: function(oEvent) {
                 //Step 1: get the selected value by user
                 var sVal = oEvent.getParameter("selectedItem").getTitle();
                 var sSupplierName = oEvent.getParameter("selectedItem").getDescription();
                 //Step 2: Set this value to our input field
                 this.oField.setValue(sVal);
                 this.oLocalModel.setProperty("/prodData/SUPPLIER_NAME", sSupplierName);
            },
            onDelete: function(){
                //Step 1: get the odata Model object
                var oDataModel = this.getOwnerComponent().getModel();
                //Step 2: fire delete
                oDataModel.remove("/ProductSet('" + this.productId + "')",{
                    success: function(){
                        //Step 3: handle success callback and clear screen
                        MessageBox.confirm("The product was deleted");
                    }
                });
                
            },
            onSave: function(){
                //Step 1: Extract the payload
                var payload = this.oLocalModel.getProperty("/prodData");
                //Step 2: Pre-checks
                if(!payload.PRODUCT_ID){
                    MessageBox.error("Please pass mandatory Id");
                    return;
                }
                //Step 3: Get the odata model object
                var oDataModel = this.getOwnerComponent().getModel();
                //if we are in update mode, we need to call different odata api
                if(this.mode === "Create"){
                    //Step 4: prepare payload
                    payload.PRODUCT_PIC_URL = payload.PRODUCT_PIC_URL + '/' + payload.PRODUCT_ID;                
                    //Step 5: call the backend using odata - POST - create
                    oDataModel.create("/ProductSet", payload, {
                        //Step 6: Handle the success callback
                        success: function(data){
                            MessageToast.show("Walla! the product is saved now in SAP");
                        },
                        //Step 7: Handle the error callback
                        error: function(oError){
                            MessageBox.error("oops! something fishy is going on");
                        }
                    });
                }else{
                    oDataModel.update("/ProductSet('" + this.productId + "')", payload,{
                        success: function(){
                            MessageToast.show("Whalla! the update is a great success");
                        },
                        error: function(){

                        }
                    });
                }              
   
            }
        });
});





