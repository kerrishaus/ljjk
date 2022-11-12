window.startRain = startRain;
window.stopRain = stopRain;
window.lightning = lightning;

export function startRain()
{
    // TODO: fade in rain
    $(".interface-container").append("<div class='rain'></div>").fadeIn(3000);
}

export function stopRain()
{
    $(".rain").fadeOut(3000, function() { $(this).remove() });
}

export function lightning()
{
    $(".rain").addClass("lightning");

    setTimeout(function()
    {
        $(".rain").removeClass("lightning");
    }, 400);
}