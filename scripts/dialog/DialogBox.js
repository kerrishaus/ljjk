export class DialogBox
{
    constructor(message, printSpeed = 100, printDelay = 300)
    {
        this.printSpeed = printSpeed;
        this.printInterval = null;
        this.printDelay = printDelay;
        this.printIteration = 0;

        this.message = message;

        this.dialog = $(`<div class='dialog-box hidden bottom'><span class='dialog-message'></span></div>`);
        $(".dialog-container").append(this.dialog)
    }

    presentDialog()
    {
        this.dialog.removeClass("hidden");

        setTimeout(() =>
        {
            this.printIteration = 0;

            this.printInterval = setInterval(() =>
            {
                $(".dialog-message").append(this.message[this.printIteration++]);

                if (this.printIteration >= this.message.length)
                    clearInterval(this.printInterval);
            }, this.printSpeed);
        }, this.printDelay);

        console.log("presented dialog");
    }

    hideDialog()
    {
        this.dialog.addClass("hidden");

        clearInterval(this.printInterval);

        console.log("hid dialog");
    }
};