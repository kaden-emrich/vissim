
function lerp(a, b, t) {
    return (1 - t) * a + b * t;
}

function multiValueLerp(values, t) {
    if(values.length < 2) {
        return -1;
    }

    if(t >= 1) {
        return multiValueLerp(values, t%1);
    }

    let gap = (1/(values.length-1));

    let index = Math.floor(t / gap);
    
    let newT = (t%gap)*(values.length-1);
    
    return lerp(values[index], values[index+1], newT);
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