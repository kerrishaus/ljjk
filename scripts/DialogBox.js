export class DialogBox
{
    constructor(options)
    {
        this.printSpeed    = options.printSpeed ?? 50;
        this.printDelay    = options.printDelay ?? 400;

        this.printDelay     = null;
        this.printInterval  = null;
        this.printIteration = 0;
        this.open           = false;

        this.message = options.message;
        this.buttons = options.buttons ?? [];
    }

    presentDialog()
    {
        $("#dialogMessage").empty();
        $("#dialogButtons").empty();

        for (const button of this.buttons)
        {
            console.log(button);
            const buttonElement = $("<button class='dialog-button'>").appendTo($("#dialogButtons"));
            buttonElement.text(button.message);
            buttonElement.on("click", button.onClick);
        }

        $("#dialogBox").addClass("shown");
        $("#dialogButtons").removeClass("shown");

        this.open = true;

        this.printTimeout = setTimeout(() =>
        {
            if (!this.open)
                return;

            this.printIteration = 0;

            this.printInterval = setInterval(() =>
            {
                $("#dialogMessage").append(this.message[this.printIteration++]);

                if (this.printIteration >= this.message.length)
                {
                    clearInterval(this.printInterval);
                    this.printInterval = null;
                    console.log("done printing");

                    $("#dialogButtons").addClass("shown");
                    $("#dialogButtons").children(".dialog-button:last-child").focus();

                    // TODO: add a close button to the dialog at this point
                }
            }, this.printSpeed);
        }, this.printDelay);

        console.log("presented dialog");
    }

    hideDialog()
    {
        $("#dialogBox").removeClass("shown");
        $("#dialogButtons").removeClass("shown");

        $("#dialogMessage").empty();
        $("#dialogButtons").empty();

        clearInterval(this.printTimeout);
        this.printTimeout  = null;
        clearInterval(this.printInterval);
        this.printInterval = null;

        this.open = false;

        console.log("hid dialog");
    }
};