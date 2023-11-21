export class DialogBox
{
    constructor(message, printSpeed = 50, printDelay = 400)
    {
        this.printSpeed = printSpeed;
        this.printInterval = null;
        this.printDelay = printDelay;
        this.printIteration = 0;
        this.open = false;

        this.message = message;
    }

    presentDialog()
    {
        $("#dialogMessage").empty();

        $("#dialogBox").addClass("shown");
        this.open = true;

        setTimeout(() =>
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

                    // TODO: add a close button to the dialog at this point
                }
            }, this.printSpeed);
        }, this.printDelay);

        console.log("presented dialog");
    }

    hideDialog()
    {
        $("#dialogBox").removeClass("shown");

        clearInterval(this.printInterval);
        this.printInterval = null;

        this.open = false;

        console.log("hid dialog");
    }
};