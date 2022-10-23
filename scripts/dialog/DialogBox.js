export class DialogBox
{
    constructor(message)
    {
        this.dialog = $(`<div class='dialogBox hidden bottom'>${message}</div>`);
        $(".dialogContainer").append(this.dialog)
    }

    presentDialog()
    {
        this.dialog.removeClass("hidden");

        console.log("presented dialog");
    }

    hideDialog()
    {
        this.dialog.addClass("hidden");

        console.log("hid dialog");
    }
};