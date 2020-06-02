module.exports = {
    initStepper: function(validateFunction){
        var stepper = document.querySelector('.stepper');
        try {
            var stepperInstace = new MStepper(stepper, {
                // options
                firstActive: 0, // this is the default,
                validateFunction: validateFunction
            })
        } catch {}
    }
}