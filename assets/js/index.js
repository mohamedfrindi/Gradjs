
// main class -------------------------------------------------------------------------------------------
class GradientGenator {

    constructor(defaultGradient , gradientExamplesList) {

        // vars ===========================
        this.selected = defaultGradient;

        this.examples = gradientExamplesList;

        this.preview = document.querySelector(".preview");

        // funcionts =======================
        this.setDefault();
        this.handleExamples();
        this.handleControls(this.selected);
    }

    handlePreview(bg) {

        let preview = this.preview;
        // =============================

        // change preview background
        preview.style.background = bg;

        // change text
        preview.innerHTML = `
            <div class="code">
                <span class="code-gr">backround: ${bg}</span>
            </div>
        `;
    }

    setDefault() {
        this.handlePreview(this.selected);
    }

    handleExamples() {  
        let examples = this.examples;
        let exampleSpans = document.querySelector(".examples");
        // =========================================

        // creat example colors
        for (let i = 0; i < examples.length; i++) {
            // crat spn color gradient
            let span = document.createElement("span");
            span.className = "color";

            // add background gradient
            span.style.background = examples[i];

            // add bg preperty value
            span.setAttribute("bg", examples[i]);

            // append span for colors
            exampleSpans.appendChild(span);
        }

        // click in btn and change bg preview
        let spans = exampleSpans.querySelectorAll(".color");

        spans.forEach((span) => {
            span.addEventListener("click", (e) => {

                spans.forEach((spn) => spn.classList.remove("active"));
                e.target.classList.add("active");

                let bg = e.target.getAttribute("bg");

                this.selected = bg;
                this.handlePreview(bg);
                this.handleControls(bg);
            });
        });
    }

    handleControls (bg) {

        // convert string to object =========================
        let bgObject = {
            type : "",
            deg : "",
            colors : []
        };

        let gradient = bg.replace("(", ",").replace(")", ",").split(',');

        let type = gradient[0];
        let objDeg = gradient[1];
        let objColors = gradient.slice(2 , gradient.length - 1);

        objColors.forEach(clr=> {

            bgObject.type = type;
            bgObject.deg = objDeg;
            bgObject.colors?.push({
                color: clr.split(" ")[1],
                rate: clr.split(" ")[2],
            });

        })


        // add colors items  ==================================
        let handleColorsItem = () => {
            let colors_numb = document.querySelector(".colors-numb");
            colors_numb.innerHTML = '';

            bgObject.colors.forEach((c , index) => {

                // create colors items =======
                let item = document.createElement("div");
                item.classList.add("item");

                item.innerHTML = `
                    <div class="item-clr">
                        <label for="clr-${index + 1}"><i class="bi bi-palette"></i> ${index + 1}</label>
                        <input type="text" name="clr-text-${index + 1}" id="clr-text-${index + 1}" class="inpt" value="${c.color}">
                        <input type="color" id="clr-inp-${index + 1}" value="${c.color}">
                    </div>
                    <div class="clr-range">
                        <input type="range" value="${c.rate.split('%')[0]}" id="rng-${index + 1}">
                        <div class='inpt'>
                            <input type="number" value="${c.rate.split('%')[0]}" id="rng-text-${index + 1}" max="100" min="0">
                            <span>%</span>
                        </div>
                    </div>
                    <button class="btn-remove"><i class="bi bi-x"></i></button>
                `;

                // append item on parent
                colors_numb.appendChild(item);


                // handle inputs change =============================
                let clr_text = document.querySelector(`#clr-text-${index + 1}`);
                let clr_inp = document.querySelector(`#clr-inp-${index + 1}`);

                let rng = document.querySelector(`#rng-${index + 1}`);
                let rng_text = document.querySelector(`#rng-text-${index + 1}`);


                // handle clr inputs
                clr_inp.addEventListener('input' , (e) => {
                    clr_text.value = e.target.value;
                    c.color = e.target.value;

                    this.convertToString(bgObject);
                })

                clr_text.addEventListener("input", (e) => {
                    clr_inp.value = e.target.value;
                    c.color = e.target.value;

                    this.convertToString(bgObject);
                });

                // handle range input
                rng.addEventListener("input", (e) => {
                    rng_text.value = e.target.value;
                    c.rate = `${e.target.value}%`;

                    this.convertToString(bgObject);
                });

                rng_text.addEventListener("input", (e) => {
                    rng.value = e.target.value;
                    c.rate = `${e.target.value}%`;

                    this.convertToString(bgObject);
                });

                // remove color ==========================
                let btn_remove = item.querySelector(".btn-remove");

                btn_remove.addEventListener("click", (e) => {
                    let filter = bgObject.colors.filter((it, i) => i !== index);
                
                    bgObject.colors = filter;

                    handleColorsItem();
                    this.convertToString(bgObject);
                });

            });
        }
        handleColorsItem();

        // handle deg ====================================
        let deg = document.querySelector(".deg");

        deg.innerHTML = `
            <div class="plain-angle-input default-input"></div>
            <div class="inpt">
                <input id="angle" type="number" value="${bgObject.deg.split('deg')[0]}" max="360" min="0">
                <span></span>
            </div>
        `;

        let deg_input = deg.querySelector('#angle');
        deg_input.addEventListener('input' , (e) => {

            let cirle = deg.querySelector(".plain-angle-input .angle-input-pivot");

            cirle.style.transform = `rotate(-${e.target.value}deg)`;

            bgObject.deg = `${e.target.value}deg`;
            this.convertToString(bgObject);
        })

        if (bgObject.type === "radial-gradient") {
            deg.style.display = 'none';
        } else {
            deg.style.display = "flex";
        }

        let plain_angle_input = deg.querySelector(".plain-angle-input");
        let angle_inpt = deg.querySelector("#angle");

        let angle = AngleInput(plain_angle_input, {
            max: 360,
            min: 0,
            step: 1,
            name: "angle",
        });
        angle(parseInt(bgObject.deg));

        plain_angle_input.addEventListener('input' , (e) => {
            let input_value = e.currentTarget.querySelector('input').value;

            bgObject.deg = `${input_value}deg`;
            angle_inpt.value = input_value;

            this.convertToString(bgObject);
        })


        // handle btns radial and linear ==========================
        let btn_ctr = document.querySelectorAll('.controls .btn-ctr');

        btn_ctr.forEach(btn => {

            btn.classList.remove('active');

            let btn_type = btn.getAttribute("type");

            if (bgObject.type === 'linear-gradient') {
                if (btn_type === 'linear') {
                    btn.classList.add('active')
                }
            }

            if (bgObject.type === "radial-gradient") {
                if (btn_type === "radial") {
                    btn.classList.add("active");
                }
            }

            // on click
            btn.addEventListener('click' , (e) => {
                btn_ctr.forEach((b) => b.classList.remove("active"));
                e.currentTarget.classList.add("active");

                let btn_clicked_type = e.currentTarget.getAttribute("type");

                // liner;
                if (btn_clicked_type === "linear") {
                    bgObject.type = "linear-gradient";
                    deg.style.display = "flex";
                } else if (btn_clicked_type === "radial") {
                    bgObject.type = "radial-gradient";
                    deg.style.display = "none";
                }

                this.convertToString(bgObject);

            })

        });


        // add new color =============================
        let add_color_btn = document.querySelector(".controls .add-color");

        add_color_btn.addEventListener('click' , (e) => {
            bgObject.colors.push({color: "#ffffff" , rate : "100%"});

            handleColorsItem();
            this.convertToString(bgObject);
        });

    }

    convertToString (obj) {

        let colors = [];

        obj.colors.forEach(c => {
            let str = `${c.color} ${c.rate}`;
            colors.push(str);
        })

        let bg;

        // if (colors.length === 1) {
        //     obj.type = 'normal';
        // }

        if (obj.type === "linear-gradient") {
            bg = `${obj.type}( ${obj.deg} , ${colors.join(",")})`;
        } else if (obj.type === "radial-gradient") {
            bg = `${obj.type}(${colors.join(",")})`;
        } else {
            // bg = `${colors[0].split(" ")[0]}`;
        }

        this.selected = bg;
        this.handlePreview(bg);
    }

}
// -----------------X-----------------------X---------------------------------X--------------------------



// run main class ---------------------------------------------------------------------------------------

// The default gradient that will appear at the beginning
let defaultGradient = "linear-gradient(90deg, #FEE140 0%, #FA709A 100%)";

// Pre-extracted list of gradients
let gradientExamplesList = [
    "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
    "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
    "linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)",
    "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
    "linear-gradient(90deg, #FEE140 0%, #FA709A 100%)",
    "linear-gradient(132deg, #F4D03F 0%, #16A085 100%)",
];


// to run the main class
new GradientGenator(defaultGradient , gradientExamplesList);
// -----------------X-----------------------X----------------------------------X----------------------------