// Kaden Emrich

class Color {
    // getters/setters
    // color types
    get rgba() {
        return this.rgba;
    }

    get hsl() {
        return this.hsl;
    }

    // values
    get red() {
        return this.rgba.red;
    }
    set red(value) {
        let newColor = this.rgba;
        newColor.red = value;
        this.values = newColor;
    }

    get green() {
        return this.rgba.green;
    }
    set green(value) {
        let newColor = this.rgba;
        newColor.green = value;
        this.values = newColor;
    }

    get blue() {
        return this.rgba.blue;
    }
    set blue(value) {
        let newColor = this.rgba;
        newColor.blue = value;
        this.values = newColor;
    }

    get alpha() {
        return this.rgba.alpha;
    }
    set alpha(value) {
        let newColor = this.rgba;
        newColor.alpha = value;
        this.values = newColor;
    }

    get hue() {
        return this.hsl.hue;
    }
    set hue(value) {
        let newColor = this.hsl;
        newColor.hue = value;
        this.values = newColor;
    }

    get saturation() {
        return this.hsl.saturation;
    }
    set saturation(value) {
        let newColor = this.hsl;
        newColor.saturation = value;
        this.values = newColor;
    }

    get lightness() {
        return this.hsl.lightness;
    }
    set lightness(value) {
        let newColor = this.hsl;
        newColor.lightness = value;
        this.values = newColor;
    }
} // class Color

class rgba extends Color {
    #r;
    #g;
    #b;
    #a;
    constructor(r=255, g=255, b=255, a=1) {
        super();

        this.#r = r;
        this.#g = g;
        this.#b = b;
        this.#a = a;
    } // constructor

    // getters/setters
    // values
    get red() {
        return this.#r;
    }
    set red(value) {
        this.#r = value;
    }

    get green() {
        return this.#g;
    }
    set green(value) {
        this.#g = value;
    }

    get blue() {
        return this.#b;
    }
    set blue(value) {
        this.#b = value;
    }

    get alpha() {
        return this.#a;
    }
    set alpha(value) {
        this.#a = value;
    }
    
    // types
    get rgba() {
        return this;
    }

    set values(colorObject) {
        this.red = colorObject.red;
        this.green = colorObject.green;
        this.blue = colorObject.blue;
        this.alpha = colorObject.alpha;
    }

    get hsl() {
        let r = this.#r / 255;
        let g = this.#g / 255;
        let b = this.#b / 255;

        const vmax = Math.max(r, g, b);
        const vmin = Math.min(r, g, b);
        let h, s, l = (vmax + vmin) / 2;

        if(vmax == vmin) {
            return [0, 0, l];
        }

        const d = vmax - vmin;
        
        s = l > 0.5 ? d/(2-vmax-vmin) : d/(vmax+vmin);

        if(vmax == r) h = (g-b)/d + (g < b ? 6 : 0);
        if(vmax == g) h = (b-r)/d + 2;
        if(vmax == b) h = (r-g)/d + 4;

        h /= 6;
        
        return new hsl(h, s, l);
    }
} // class rgba

class hsl extends Color {
    #h;
    #s;
    #l;
    constructor(h=1, s=1, l=1) {
        super();
        this.#h = h;
        this.#s = s;
        this.#l = l;
    } // constructor

    // getters / setters
    // values
    get hue() {
        return this.#h;
    }
    set hue(value) {
        this.#h = value;
    }

    get saturation() {
        return this.#s;
    }
    set saturation(value) {
        this.#s = value;
    }

    get lightness() {
        return this.#l;
    }
    set lightness(value) {
        this.#l = value;
    }

    // types
    get hsl() {
        return this;
    }

    set values(colorObject) {
        this.hue = colorObject.hue;
        this.saturation = colorObject.saturation;
        this.lightness = colorObject.lightness;
    }

    get rgba() {
        let hue = this.#h;
        let saturation = this.#s;
        let lightness = this.#l;
        let red, green, blue;

        if(saturation == 0) { // achromatic
            let l = Math.floor(255*lightness)
            return new rgba(l, l, l, 1);
        }

        const q = lightness < 0.5 ? lightness * (1+saturation) : lightness+saturation - lightness*saturation;
        const p = 2 * lightness - q;
        
        red = Math.floor(this.#hueToRgb(p, q, hue + 1/3) * 255);
        green = Math.floor(this.#hueToRgb(p, q, hue) * 255);
        blue = Math.floor(this.#hueToRgb(p, q, hue - 1/3) * 255);

        return new rgba(red, green, blue);
    }
    #hueToRgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }
} // class hsl

/*

let c1 = new rgba(255, 255, 255, 1);
c1.hsl // returns hsl object

c1.hue = 1 // c1 is now an object of class hsl (note: I now know that it isn't really posible to change an object's class from within itself)

*/

let colorTests = new TestGroup([
    new Test(
        'test 1',
        () => {
            let c1 = new hsl(0.49, 1, 0.77);
            c1.green = 0;
            return c1.hue;
        }, // test
        273/360, // expected output
        0.01 //acceptable variance
    ),
    new Test(
        'test 2',
        () => {
            let c1 = new hsl(273/360, 1, 0.484);
            c1.green = 255;
            return c1.hue;
        },
        176/360,
        0.01
    )
]);