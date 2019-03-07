function create_ik_mesh(octahedron_geometry){
    
    const octahedron_material = new THREE.MeshBasicMaterial( { 
        color: new THREE.Color( 0, 0, 1 ), 
        depthTest: false, 
        depthWrite: false, 
        transparent: true } );
    //octahedron_material.wireframe = true;

    const mesh = new THREE.Mesh( octahedron_geometry, octahedron_material );

    return mesh;

}

function create_ik_helper(model, scene){

    model.updateMatrixWorld(true);
    // IK
    const ik_scene = new THREE.Scene();
    ik_scene.name = 'IK_SCENE';

    const octahedron_geometry = new THREE.OctahedronBufferGeometry(20, 0);

    let ik = create_ik_mesh(octahedron_geometry);
    ik.name = 'Hip_IK';
    // set this.ik.position
    let bone = model.major_bone_list['J_Bip_C_Hips'];
    ik.position.copy(bone.position);
    ik.position.applyMatrix4(bone.parent.matrixWorld);
    ik.selected = false;
    ik_scene.add(ik);
    

    // left hand
    ik = create_ik_mesh(octahedron_geometry);
    ik.name = 'L_Hand_IK';
    // set this.ik.position
    bone = model.major_bone_list['J_Bip_L_Hand'];
    ik.position.copy(bone.position);
    ik.position.applyMatrix4(bone.parent.matrixWorld);
    ik.selected = false;
    ik_scene.add(ik);

    // right hand
    ik = create_ik_mesh(octahedron_geometry);
    ik.name = 'R_Hand_IK';
    // set this.ik.position
    bone = model.major_bone_list['J_Bip_R_Hand'];
    ik.position.copy(bone.position);
    ik.position.applyMatrix4(bone.parent.matrixWorld);
    ik.selected = false;
    ik_scene.add(ik);

    // left foot
    ik = create_ik_mesh(octahedron_geometry);
    ik.name = 'L_Foot_IK';
    // set this.ik.position
    bone = model.major_bone_list['J_Bip_L_Foot'];
    ik.position.copy(bone.position);
    ik.position.applyMatrix4(bone.parent.matrixWorld);
    ik.selected = false;
    ik_scene.add(ik);

    // left foot
    ik = create_ik_mesh(octahedron_geometry);
    ik.name = 'R_Foot_IK';
    // set this.ik.position
    bone = model.major_bone_list['J_Bip_R_Foot'];
    ik.position.copy(bone.position);
    ik.position.applyMatrix4(bone.parent.matrixWorld);
    ik.selected = false;
    ik_scene.add(ik);


    model.add(ik_scene);
    console.log('model', model);
    // 複数モデルの場合、すべてのモデルからIKリストを作成する処理に変更
    scene.all_ik_list = [];
    for(let i = 0; i < ik_scene.children.length; ++i){
        console.log('ik_scene', ik_scene.children[i]);
        scene.all_ik_list.push(ik_scene.children[i]);
    }

}

function ik_update(scene){
    
    if(scene === undefined ){
        return;
    }
    scene.updateMatrixWorld(true);

    for(let i = 0; i < scene.children.length; ++i){
        if ( scene.children[i].name === 'Model_Girl' || scene.children[i].name === 'Model_Boy' ){
            
            let model = scene.children[i];
            let ik_scene = model.getObjectByName('IK_SCENE');
            //console.log('model', model);

            // hip
            let ik = ik_scene.getObjectByName('Hip_IK');
            let bone = model.getObjectByName('J_Bip_C_Hips');
            let inv = new THREE.Matrix4();
            inv.getInverse(bone.parent.matrixWorld);
            let vec = ik.position.clone();
            vec.applyMatrix4(inv);
            bone.position.set(vec.x, vec.y, vec.z);

            // left hand
            ik = ik_scene.getObjectByName('L_Hand_IK');
            bone = model.getObjectByName('J_Bip_L_Hand');
            update_ik_arm_leg(ik, bone);

            // right hand
            ik = ik_scene.getObjectByName('R_Hand_IK');
            bone = model.getObjectByName('J_Bip_R_Hand');
            update_ik_arm_leg(ik, bone);

            // left foot
            ik = ik_scene.getObjectByName('L_Foot_IK');
            bone = model.getObjectByName('J_Bip_L_Foot');
            update_ik_arm_leg(ik, bone);

            // right foot
            ik = ik_scene.getObjectByName('R_Foot_IK');
            bone = model.getObjectByName('J_Bip_R_Foot');
            update_ik_arm_leg(ik, bone);

        }
    }
}

function update_ik_arm_leg(ik, child_bone){
    
    /**********************************************************************
    ***********************************************************************
    腕、足、ボーンを動かす
    ***********************************************************************
    ***********************************************************************/
    // ボーンを動かす
    // 目的座標
    let destination = ik.position.clone();
    destination = child_bone.parent.worldToLocal(destination);
    let prevent_tip = new THREE.Vector3();
    prevent_tip.setFromMatrixPosition(child_bone.matrixWorld);
    prevent_tip = child_bone.parent.worldToLocal(prevent_tip);

    let axis = new THREE.Vector3();
    axis.crossVectors( prevent_tip, destination ).normalize();
    let angle = Math.acos( prevent_tip.dot(destination) / (prevent_tip.length() * destination.length()) );
    
    if( (axis.x !== 0 || axis.y !== 0 || axis.z !== 0 ) &&
        ( !isNaN(axis.x) && !isNaN(axis.y) && !isNaN(axis.z) && !isNaN(angle) ) ){

        let parent = child_bone.parent;
        
        let quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( axis, angle );
        parent.quaternion.multiply( quaternion );

        // setting rotation limit
        apply_limit_rotation(parent);

    }
    

    /**********************************************************************
    ***********************************************************************
    にの腕、太もも、ボーンを動かす
    ***********************************************************************
    ***********************************************************************/

    // 変更を適用
    child_bone.updateMatrixWorld();
    child_bone.parent.updateMatrixWorld();
    
    // 目的座標を更新
    destination = ik.position.clone();
    let direction = new THREE.Vector3();
    direction.setFromMatrixPosition(child_bone.parent.matrixWorld);
    direction.sub(new THREE.Vector3().setFromMatrixPosition(child_bone.matrixWorld));
    destination.add(direction);

    //const t = create_ik_mesh();
    //t.position.copy(destination);
    //scene.add(t);

    destination = child_bone.parent.parent.worldToLocal(destination);
    prevent_tip.setFromMatrixPosition(child_bone.parent.matrixWorld);
    prevent_tip = child_bone.parent.parent.worldToLocal(prevent_tip);

    axis.crossVectors( prevent_tip, destination ).normalize();
    angle = Math.acos( prevent_tip.dot(destination) / (prevent_tip.length() * destination.length()) );

    if( (axis.x !== 0 || axis.y !== 0 || axis.z !== 0 ) &&
        ( !isNaN(axis.x) && !isNaN(axis.y) && !isNaN(axis.z) && !isNaN(angle) ) ){

        let grand_parent = child_bone.parent.parent;

        let quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( axis, angle * 0.2 );
        grand_parent.quaternion.multiply( quaternion );

        // setting rotation limit
        apply_limit_rotation(grand_parent);
        
    }


    /**********************************************************************
    ***********************************************************************
    肩、ボーンを動かす
    ***********************************************************************
    ***********************************************************************/
    // 肩以外ならリターン
    if( !(child_bone.name === 'J_Bip_L_Hand' || child_bone.name === 'J_Bip_R_Hand') ){
        return;
    }

    // 変更を適用
    child_bone.parent.updateMatrixWorld();
    child_bone.parent.parent.updateMatrixWorld();
    
    // 目的座標を更新
    destination = ik.position.clone();
    // grand child bone direction
    direction.setFromMatrixPosition(child_bone.parent.matrixWorld);
    direction.sub(new THREE.Vector3().setFromMatrixPosition(child_bone.matrixWorld));
    destination.add(direction);

    // child bone direction
    direction.setFromMatrixPosition(child_bone.parent.parent.matrixWorld);
    direction.sub(new THREE.Vector3().setFromMatrixPosition(child_bone.parent.matrixWorld));
    destination.add(direction);


    destination = child_bone.parent.parent.parent.worldToLocal(destination);
    prevent_tip.setFromMatrixPosition(child_bone.parent.parent.matrixWorld);
    prevent_tip = child_bone.parent.parent.parent.worldToLocal(prevent_tip);

    axis.crossVectors( prevent_tip, destination ).normalize();
    angle = Math.acos( prevent_tip.dot(destination) / (prevent_tip.length() * destination.length()) );

    if( (axis.x !== 0 || axis.y !== 0 || axis.z !== 0 ) &&
        ( !isNaN(axis.x) && !isNaN(axis.y) && !isNaN(axis.z) && !isNaN(angle) ) ){

        let great_grand_parent = child_bone.parent.parent.parent;

        let quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( axis, angle * 0.05 );
        great_grand_parent.quaternion.multiply( quaternion );

        // setting rotation limit
        apply_limit_rotation(great_grand_parent);
        
    }

}

function apply_limit_rotation(bone){
    let euler = new THREE.Euler();
    let quaternion = new THREE.Quaternion();

    // 左肩
    if( bone.name === 'J_Bip_L_Shoulder' ){
        euler.setFromQuaternion(bone.quaternion, 'XZY', true);
        euler_canonical_set(euler);
        if( euler.y > Math.PI/6 ){
            euler.y = Math.PI/6;
        }
        else if ( euler.y < -Math.PI/6 ){
            euler.y = -Math.PI/6;
        }

        euler.x = 0;

        if( euler.z < -Math.PI * 45/180 ){
            euler.z = -Math.PI * 45/180;
        }
        else if( euler.z > 0 ){
            euler.z = 0;
        }
        //euler.z = 0;
        
        //console.log('rotation ', new THREE.Vector3(euler.x, euler.y, euler.z).multiplyScalar(180/Math.PI));
        quaternion.setFromEuler(euler);
        bone.quaternion.copy(quaternion);
    }

    // 右肩
    if( bone.name === 'J_Bip_R_Shoulder' ){
        euler.setFromQuaternion(bone.quaternion, 'XZY', true);
        euler_canonical_set(euler);
        if( euler.y < -Math.PI/6 ){
            euler.y = -Math.PI/6;
        }
        else if ( euler.y > Math.PI/6 ){
            euler.y = Math.PI/6;
        }

        euler.x = 0;

        if( euler.z > Math.PI * 45/180 ){
            euler.z = Math.PI * 45/180;
        }
        else if( euler.z < 0 ){
            euler.z = 0;
        }
        //euler.z = 0;
        
        //console.log('rotation ', new THREE.Vector3(euler.x, euler.y, euler.z).multiplyScalar(180/Math.PI));
        quaternion.setFromEuler(euler);
        bone.quaternion.copy(quaternion);
    }

    // 左にの腕
    if( bone.name === 'J_Bip_L_UpperArm' ){
        euler.setFromQuaternion(bone.quaternion, 'YXZ', true);
        euler_canonical_set(euler);
        if( euler.y < -Math.PI * 160/180 ){
            euler.y = -Math.PI * 160/180;
        }
        else if ( euler.y > 0 ){
            euler.y = 0;
        }

        if( euler.x > Math.PI/2){
            euler.x = Math.PI/2;
        }
        else if( euler.x < -Math.PI/2){
            euler.x = -Math.PI/2;
        }
        
        if( euler.z > Math.PI *120/180 ){
            euler.z = Math.PI *120/180;
        }
        else if( euler.z < -Math.PI *50/180 ){
            euler.z = -Math.PI *50/180;
        }
        
        //console.log('rotation ', new THREE.Vector3(euler.x, euler.y, euler.z).multiplyScalar(180/Math.PI));
        quaternion.setFromEuler(euler);
        bone.quaternion.copy(quaternion);
    }

    // 右にの腕
    if( bone.name === 'J_Bip_R_UpperArm' ){
        euler.setFromQuaternion(bone.quaternion, 'YXZ', true);
        euler_canonical_set(euler);
        if( euler.y > Math.PI * 160/180 ){
            euler.y = Math.PI * 160/180;
        }
        else if ( euler.y < 0 ){
            euler.y = 0;
        }

        if( euler.x < -Math.PI/2){
            euler.x = -Math.PI/2;
        }
        else if( euler.x > Math.PI/2){
            euler.x = Math.PI/2;
        }
        
        if( euler.z < -Math.PI *120/180 ){
            euler.z = -Math.PI *120/180;
        }
        else if( euler.z >Math.PI *50/180 ){
            euler.z = Math.PI *50/180;
        }

        //console.log('rotation ', new THREE.Vector3(euler.x, euler.y, euler.z).multiplyScalar(180/Math.PI));
        quaternion.setFromEuler(euler);
        bone.quaternion.copy(quaternion);
    }

    // 左腕
    if( bone.name === 'J_Bip_L_LowerArm' ){

        euler.setFromQuaternion(bone.quaternion, 'YZX', true);
        euler_canonical_set(euler);
        if( euler.y < -Math.PI * 170/180 ){
            euler.y = -Math.PI * 170/180 ;
        }
        else if ( euler.y > 0 ){
            euler.y = 0;
        } 
        euler.z = 0;
        //euler.x = 0;
        if( euler.x < -Math.PI/4 ){
            euler.x = -Math.PI/4;
        }else if( euler.x > Math.PI/4 ){
            euler.x = Math.PI/4;
        }
        
        //console.log('rotation ', new THREE.Vector3(euler.x, euler.y, euler.z).multiplyScalar(180/Math.PI));
        quaternion.setFromEuler(euler);
        bone.quaternion.copy(quaternion);
    }

    // 右腕
    if( bone.name === 'J_Bip_R_LowerArm' ){
        
        euler.setFromQuaternion(bone.quaternion, 'YZX', true);
        euler_canonical_set(euler);
        if( euler.y > Math.PI * 170/180 ){
            euler.y = Math.PI * 170/180 ;
        }
        else if ( euler.y < 0 ){
            euler.y = 0;
        } 
        euler.z = 0;
        //euler.x = 0;
        if( euler.x > Math.PI/4 ){
            euler.x = Math.PI/4;
        }else if( euler.x < -Math.PI/4 ){
            euler.x = -Math.PI/4;
        }

        //console.log('rotation ', new THREE.Vector3(euler.x, euler.y, euler.z).multiplyScalar(180/Math.PI));
        quaternion.setFromEuler(euler);
        bone.quaternion.copy(quaternion);

    }

    // 足 太もも
    if( bone.name === 'J_Bip_L_UpperLeg' || bone.name === 'J_Bip_L_UpperLeg' ){

        euler.setFromQuaternion(bone.quaternion, 'XZY', true);
        euler_canonical_set(euler);

        if( euler.y < -Math.PI/2 ){
            euler.y = -Math.PI/2;
        }
        else if( euler.y > Math.PI/2){
            euler.y = Math.PI/2;
        }
        // left
        if( bone.name === 'J_Bip_L_UpperLeg' ){
            if( euler.z > Math.PI/6 ){
                euler.z = Math.PI/6;
            }
            else if( euler.z < -5/6 * Math.PI){
                euler.z = -5/6 * Math.PI;
            }
        }
        //console.log('rotation ', new THREE.Vector3(euler.x, euler.y, euler.z).multiplyScalar(180/Math.PI));
        quaternion.setFromEuler(euler);
        bone.quaternion.copy(quaternion);
    }

    // 足
    if( bone.name === 'J_Bip_L_LowerLeg' || bone.name === 'J_Bip_R_LowerLeg' ){
        
        euler.setFromQuaternion(bone.quaternion, 'XYZ', true);
        euler_canonical_set(euler);
        euler.y = 0;
        euler.z = 0;
        /*if( euler.x > Math.PI/2 ){
            euler.x = -Math.PI;
        }
        else */if( euler.x > 0){
            euler.x = 0;
        }
        //console.log('rotation ', new THREE.Vector3(euler.x, euler.y, euler.z).multiplyScalar(180/Math.PI));
        quaternion.setFromEuler(euler);
        bone.quaternion.copy(quaternion);

    }

}

function euler_canonical_set(euler){

    if( !euler.isEuler ){
        return;
    }

    // heading
    if ( euler.order[0] === 'X' ){
        if( euler.x < -Math.PI ){
            euler.x = -Math.PI;
        }else if( euler.x > Math.PI ){
            euler.x = Math.PI;
        }
    }else if ( euler.order[0] === 'Y' ){
        if( euler.y < -Math.PI ){
            euler.y = -Math.PI;
        }else if( euler.y > Math.PI ){
            euler.y = Math.PI;
        }
    }else if ( euler.order[0] === 'Z' ){
        if( euler.z < -Math.PI ){
            euler.z = -Math.PI;
        }else if( euler.z > Math.PI ){
            euler.z = Math.PI;
        }
    }

    // picchi
    if ( euler.order[1] === 'X' ){
        if( euler.x < -Math.PI/2 ){
            euler.x = -Math.PI/2;
        }else if( euler.x > Math.PI/2 ){
            euler.x = Math.PI/2;
        }
    }else if ( euler.order[1] === 'Y' ){
        if( euler.y < -Math.PI/2 ){
            euler.y = -Math.PI/2;
        }else if( euler.y > Math.PI/2 ){
            euler.y = Math.PI/2;
        }
    }else if ( euler.order[1] === 'Z' ){
        if( euler.z < -Math.PI/2 ){
            euler.z = -Math.PI/2;
        }else if( euler.z > Math.PI/2 ){
            euler.z = Math.PI/2;
        }
    }

    // bank
    if ( euler.order[2] === 'X' ){
        if( euler.x < -Math.PI ){
            euler.x = -Math.PI;
        }else if( euler.x > Math.PI ){
            euler.x = Math.PI;
        }
    }else if ( euler.order[2] === 'Y' ){
        if( euler.y < -Math.PI ){
            euler.y = -Math.PI;
        }else if( euler.y > Math.PI ){
            euler.y = Math.PI;
        }
    }else if ( euler.order[2] === 'Z' ){
        if( euler.z < -Math.PI ){
            euler.z = -Math.PI;
        }else if( euler.z > Math.PI ){
            euler.z = Math.PI;
        }
    }
}