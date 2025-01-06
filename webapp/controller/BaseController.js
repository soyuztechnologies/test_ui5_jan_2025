sap.ui.define(["sap/ui/core/mvc/Controller"],function(Controller){
    return Controller.extend("ey.sd.sls.controller.BaseController",{
        x: "anubhav",
        thisIsAKillerFunction: function(){
            alert("I am a killer function " + this.x);
        }
    });
});