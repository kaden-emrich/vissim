
function lerp(a, b, t) {
    return (1 - t) * a + b * t;
}

function snapLerp(a, b, t, snap) {
    let l = (1 - t) * a + b * t;
    if(
        l < a && l + snap >= a ||
        l > a && l - snap <= a
    ) {
        l = a;
    }
    else if(
        l < b && l + snap >= b ||
        l > b && l - snap <= b
    ) {
        l = b;
    }

    return l;
}

function snapLerpA(a, b, t, snap) {
    let l = (1 - t) * a + b * t;
    if(
        l < a && l + snap >= a ||
        l > a && l - snap <= a
    ) {
        l = a;
    }

    return l;
}

function snapLerpB(a, b, t, snap) {
    let l = (1 - t) * a + b * t;
    if(
        l < b && l + snap >= b ||
        l > b && l - snap <= b
    ) {
        l = b;
    }

    return l;
}