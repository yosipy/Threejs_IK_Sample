class RendererContext{
    constructor(div_id_name, canvas_id_name, scene){
        this.div_id_name = div_id_name;
        this.canvas_id_name = canvas_id_name;
        this.scene = scene;

        this.width = document.getElementById(div_id_name).clientWidth;
        this.height = document.getElementById(div_id_name).clientHeight;


        this.renderer = this.make_renderer(canvas_id_name, false);
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
        this.camera.position.set(0, 400, -900);

        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableKeys = false;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.RIGHT,
            RIGHT: THREE.MOUSE.MIDDLE
        }
        this.controls.target = new THREE.Vector3( 0, 400, 0 );
        this.controls.minDistance = 100;
        this.controls.maxDistance = 3000;

        this.ik_controller = new IKController(this, this.scene);
    }
    resize(){
        this.width = document.getElementById(this.div_id_name).clientWidth;
        this.height = document.getElementById(this.div_id_name).clientHeight;

        // レンダラーのサイズを調整する
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);

        // カメラのアスペクト比を正す
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

    }
    render(){
        // per frame
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    make_renderer(canvas_id_name, allow_alpha){
        // レンダラーを作成
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#'+canvas_id_name),
            alpha: allow_alpha,
            antialias: true
        });
        if(allow_alpha){
            renderer.setClearAlpha(0);
        }
        renderer.gammaOutput = true;
        renderer.gammaFactor = 2.2;
        renderer.setPixelRatio(1);
        renderer.setSize(this.width, this.height);
    
        return renderer;
    }
}


