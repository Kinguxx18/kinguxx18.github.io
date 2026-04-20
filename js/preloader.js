(() => {
    const preloader = document.getElementById("preloader");
    if(!preloader || matchMedia("(prefers-reduced-motion: reduce)").matches
    ){
        if(preloader) preloader.style.display = "none";
        return;
    }

    const loader = preloader.querySelector(".loader");
    if(!loader) return;

    preloader.classList.add("fade-out");
    const fadeMs =
        parseFloat(
            getComputedStyle(preloader).transitionDuration,
        ) * 1000 || 1000;
    preloader.classList.remove("fade-out");

    "MY PERSONAL PAGE".split("").forEach((c, i) =>{
        const span = document.createElement("span");
        span.textContent = c === " " ? "\u00A0" : c;
        span.style.setProperty("--index", i);
        loader.appendChild(span);
    });

    document.documentElement.classList.add(
        "preloader-active",
    );

    let done = false;
    const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        preloader.classList.add("fade-out");
        setTimeout(() => {
            document.documentElement.classList.remove("preloader-active");
            preloader.classList.add("hidden");
            preloader.setAttribute("aria-hidden", "true")  
        }, fadeMs);
    };

    const lastSpan = loader.lastElementChild;
    let fallback = 5000;
    if(lastSpan){
        const cs = getComputedStyle(lastSpan);
        const durStr = cs.animationDuration;
        const delStr = cs.animationDelay;

        if(durStr && delStr){
            const dur = Math.max(
                ...durStr
                .split(",")
                .map((s) => parseFloat(s) * 1000 || 0),
            );

            const del = Math.max(
                ...delStr
                .split(",")
                .map((s) => parseFloat(s) * 1000 || 0),
            );
            if(!isNaN(dur) && !isNaN(del)){
                fallback = dur + del + fadeMs + 500;
            }
        }
        lastSpan.addEventListener(
            "animationend",
            (e) => e.animationName === "zoomRotate" && finish(),
            { once: true},
        );
    }
    

   const timer = setTimeout(finish, fallback);
})();

