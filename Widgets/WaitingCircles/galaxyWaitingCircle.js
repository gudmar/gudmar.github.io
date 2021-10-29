class GalaxyWaitingCircle extends WaitingCircleGeneralClass{
    constructor(context){
        super();
        this.context = context; // this from customWebComponent
    }


    _getTemplate(){
        return `
        <style>
        *{
            --year-duration: 1.3s;
        }
        .center{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .size-small{ 
            --circle-radius: 60px; 
            --orbit-size: 60px;
            --star-size: 18px;
            --planet-size: 8px;
        }
        
        .size-medium{ 
            --circle-radius: 100px; 
            --orbit-size: 100px;
            --star-size: 40px;
            --planet-size: 15px
        }
        .size-big{ 
            --circle-radius: 150px; 
            --orbit-size: 150px;
            --star-size: 60px;
            --planet-size: 22px
        }
        .color-theme-green{
            --color-dark: darkgreen;
            --color-light: YellowGreen;
        }
        .color-theme-blue{
            --color-dark: blue;
            --color-light: rgb(180, 180, 255) ;
        }
        .color-theme-gray{
            --color-dark: darkGray;
            --color-light: rgb(220, 220, 220) ;
        }
        .color-theme-red{
            --color-dark: red;
            --color-light: rgb(255, 180, 180) ;
        }
        
        .wrapper {
            position: relative;
            width: var(--circle-radius);
            height: var(--circle-radius);
            transform: rotateX(60deg);
            transform-style: preserve-3d;
        }

        .orbit {
            
            position: relative;
            width: var(--orbit-size);
            height: var(--orbit-size);
            border-radius: 50%;
            border: solid var(--color-light) thin;
            justify-items: center;
            align-items: center;
            justify-content: center;
            
            transform-style: preserve-3d;
            overflow: visible;
            animation: rotate-orbit var(--year-duration) linear infinite;
        }
        .star {
            position: absolute;
            width: var(--star-size);
            height: var(--star-size);
            top: calc( 50% - 0.5*var(--star-size) );
            left: calc( 50% - 0.5*var(--star-size) );
            border-radius: 50%;
            background-color: var(--color-dark);
            transform-style: preserve-3d;
            animation: counter-orbit-rotation var(--year-duration) linear infinite;
            z-index: 100;
        }
        .planet {
            position: absolute;
            top: 0;
            width: var(--planet-size);
            height: var(--planet-size);
            background-color: var(--color-dark);
            border-radius: 50%;
            top: calc( 0.5 * var(--planet-size));
            left: calc( 0.5 * var(--planet-size));
            transform-style: preserve-3d;
            animation: counter-orbit-rotation var(--year-duration) linear infinite;
            z-index: 100;
        }




        @keyframes rotate-orbit{
            0% {transform: rotateZ(0deg);}
            100% {transform: rotateZ(360deg);}
        }
        @keyframes counter-orbit-rotation{
            0% {transform:  rotateX(90deg) rotateY(0deg) rotateZ(0deg); }
            100% {transform:  rotateX(90deg) rotateY(-360deg) rotateZ(0deg); }
        }


        </style>
        <div class = "wrapper circle size-${this.size} center">
            <div class = "circle orbit size-${this.size} galaxy-waiting-circle rotate color-theme-${this.colorTheme}">
                <div class = "circle size-${this.size} planet color-theme-${this.colorTheme}"></div>
                <div class = "circle size-${this.size} star color-theme-${this.colorTheme}"></div>
            </div>
        </div>
        
        `
    }
}