window.addEventListener('DOMContentLoaded', init);
function init() {
    // シーンを作成
    const scene = new THREE.Scene();

    // 平行光源
    const light = new THREE.DirectionalLight(0xFFFFFF);
    light.intensity = 2; // 光の強さを倍に
    light.position.set(1, 1, 1);
    scene.add(light);

    // cretate grid
    let size = 5000;
    let divisions = 10;
    const gridHelper = new THREE.GridHelper( size, divisions, new THREE.Color(0,0,1), new THREE.Color(1,1,1) );
    scene.add( gridHelper );

    // ウィンドウサイズ設定
    const main = new RendererContext('main', 'main_canvas_0', scene);


    // Load GLTF or GLB
    //const url = 'http://localhost/Three.js_sample_ik/test.glb';
    //const url = 'https://yosipy.github.io/Threejs_IK_Sample/test.glb';
    const url = 'test.glb';
    load_gltf_model('Model_Girl', url, scene);

    
    angle = Math.PI/2;
    // 初回実行
    tick();
    function tick() {
        ik_update(scene);

        main.render(scene);
        requestAnimationFrame(tick);
    }

    // 初期化のために実行
    onResize();
    // リサイズイベント発生時に実行
    window.addEventListener('resize', onResize);
    function onResize() {
        main.resize();
    }
}


function load_gltf_model(name, url, scene){
    // Load GLTF or GLB
    const loader = new THREE.GLTFLoader();
    loader.load(
        url,
        // onLoader
        function ( gltf ){
            const model = gltf.scene;
            model.name = name;

            function children_frustum_culled_to_false(model){
                for(let i = 0; i < model.children.length; ++i){
                    let child = model.children[i];
                    if(child.type === 'Object3D' || child.type === 'SkinnedMesh'){
                        child.frustumCulled = false;
                    }
                    children_frustum_culled_to_false(child);
                }
            }
            children_frustum_culled_to_false(model);

            create_skeleton_helper(model);



            model.children[0].children[0].scale.set(400.0, 400.0, 400.0);

            // if updateMatrixWorld not exist, scale is not applied.
            model.updateMatrixWorld(true);
            
            scene.add(model);

            create_ik_helper(model, scene);

            console.log('model', model);
        },
        // onProgress
        function( xhr ) {
            console.log(xhr.lengthComputable);
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
                document.getElementById('result').innerHTML = String( Math.round( percentComplete, 2 ) ) + '% downloaded';
            }else{
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
                document.getElementById('result').innerHTML = String( xhr.loaded ) + '/ 10268960 downloaded';
            }

        },
        // onError
        function ( error ) {
            console.log( 'An error happened' );
            console.log( error );
        }
    );
}
