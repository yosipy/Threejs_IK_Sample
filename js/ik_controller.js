class IKController{
    constructor(renderer_context, scene){

        this.renderer_context = renderer_context;
        this.div_id = document.getElementById(renderer_context.div_id_name);
        this.scene = scene;
        this.camera = renderer_context.camera;

        this.mouse_down = false;
        this.prevent_coodinate = new THREE.Vector3(null, null, null);

        this.plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1000000, 1000000 ), new THREE.MeshBasicMaterial() );

        let _this = this;

        this.div_id.addEventListener( 'mousedown', onDocumentMouseDown, false );
        function onDocumentMouseDown( event ) {
            event.preventDefault();
            console.log('mouse down');
            _this.mouse_down = true;

            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / _this.renderer_context.width) * 2 - 1;
            mouse.y = - (event.clientY / _this.renderer_context.height) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera( mouse, _this.camera );
            console.log('raycaster', raycaster);
            const intersects = raycaster.intersectObjects( _this.scene.all_ik_list , true);
            
            console.log('intersects', intersects);
            if( intersects.length > 0 ) {
                _this.select_ik(intersects[0].object);

                _this.plane.position.copy(intersects[0].object.position);
                _this.plane.lookAt(_this.renderer_context.camera.position);
                _this.plane.updateMatrixWorld();
                console.log(_this.plane);
                const intersects2 = raycaster.intersectObject( _this.plane );
                if( intersects2.length > 0 ) {
                    // IKコントローラーの座標計算
                    let now_coodinate = intersects2[0].point;
                    _this.prevent_coodinate.copy(now_coodinate);
                }
                
            }else{
                _this.deselect_ik();
            }

        }
        this.div_id.addEventListener( 'mousemove', onDocumentMouseMove, false );
        function onDocumentMouseMove( event ){
            event.preventDefault();
            //console.log('mouse move');

            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / _this.renderer_context.width) * 2 - 1;
            mouse.y = - (event.clientY / _this.renderer_context.height) * 2 + 1;

            if( _this.mouse_down === true ){
    
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera( mouse, _this.camera );
                //console.log('raycaster', raycaster);
                _this.plane.lookAt(_this.renderer_context.camera.position);
                _this.plane.updateMatrixWorld();
                const intersects = raycaster.intersectObject( _this.plane );
                //console.log('intersects', intersects);
                if( intersects.length > 0 ) {

                    _this.select_ik(intersects[0].object);

                    // IKコントローラーの座標計算
                    let now_coodinate = intersects[0].point;
                    //console.log('pointer: ', now_coodinate);
                    //移動ベクトル計算
                    let vec = intersects[0].point.clone();
                    vec.sub(_this.prevent_coodinate);

                    for(let ik of _this.scene.all_ik_list){
                        if(ik.selected === true){
                            ik.position.add(vec);
                        }
                    }

                    _this.prevent_coodinate.copy(now_coodinate);
                   // console.log(vec);

                }else{
                    _this.deselect_ik();
                }

            }
            
        }
        this.div_id.addEventListener( 'mouseup', onDocumentMouseUp, false );
        function onDocumentMouseUp( event ) {
            event.preventDefault();
            console.log('mouse up');
            _this.mouse_down = false;

            //ik_update(scene);
        }
        this.div_id.addEventListener( 'mouseover', onDocumentMouseOver, false );
        function onDocumentMouseOver( event ) {
            event.preventDefault();
            console.log('mouse over');
            _this.mouse_down = false;

            
        }
        this.div_id.addEventListener( 'mouseout', onDocumentMouseOut, false );
        function onDocumentMouseOut( event ) {
            event.preventDefault();
            console.log('mouse out');
            _this.mouse_down = false;
        }
    }
    select_ik(mesh_ik){
        mesh_ik.selected = true;
        mesh_ik.material.color.setRGB(1,0,0);
    }
    deselect_ik(){
        for(let ik of this.scene.all_ik_list){
            
            ik.selected = false;
            ik.material.color.setRGB(0,0,1);

        }
        //mesh_ik.selected = false;
        //mesh_ik.material.color.setRGB(0,0,1);
    }
}