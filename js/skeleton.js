class SkeletonPropertyWithoutHand{
    constructor(bone,
                key_up_name, key_down_name, key_left_name, key_right_name,
                start_pos, end_pos, scale){
        this.bone = bone;

        this.key_up_name = key_up_name;
        this.key_down_name = key_down_name;
        this.key_left_name = key_left_name;
        this.key_right_name = key_right_name;

        this.start_pos = start_pos;
        this.end_pos = end_pos;
        this.scale = scale; // vec2 [0] is x-y scale(thickness). [1] is z scale(length).
    }
}
function make_major_skeleton_list(model){
    function get_bone_list( object ) {
        let boneList = [];
        if ( object && object.isBone ) {
            boneList.push( object );
        }
        for ( var i = 0; i < object.children.length; i ++ ) {
            boneList.push.apply( boneList, get_bone_list( object.children[ i ] ) );
        }
        return boneList;
    }

    let model_bone_array = get_bone_list(model);
    let model_bone_list = {};
    for(let i = 0; i < model_bone_array.length; ++i){
        let bone = model_bone_array[i];
        model_bone_list[bone.name] = bone;
    }
    //console.log('model_bone_list', model_bone_list);

    let major_skeleton_list = {
        'J_Bip_C_Head' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_C_Head'], 
                                null, 'J_Bip_C_Neck', null, null,
                                [0.00009627805794972002 , 1.3862350200000002 , 0.007967086100000001],
                                [0.0002611630579497197 , 1.4448182800000002 , 0.007967086100000001/*-0.0746865139*/],
                                [1.5, 1.5]),
        'J_Bip_C_Neck' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_C_Neck'], 
                                'J_Bip_C_Head', 'J_Bip_C_UpperChest', 'J_Bip_R_Shoulder', 'J_Bip_L_Shoulder',
                                [0.00026121113894972 , 1.3140256600000002 , 0.0172741021],
                                [0.00009627805794972002 , 1.3862350200000002 , 0.007967086100000001],
                                [1.0, 0.8]),
        // Left Arm
        'J_Bip_L_Shoulder' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_L_Shoulder'], 
                                'J_Bip_C_Neck', 'J_Bip_C_UpperChest', 'J_Bip_R_Shoulder', 'J_Bip_L_UpperArm',
                                [-0.02212442731092028 , 1.2866745200000003 , 0.011321255799999999],
                                [-0.10841912301092027 , 1.2718053069000002 , 0.005957500799999999],
                                [1.0, 0.8]),
        'J_Bip_L_UpperArm' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_L_UpperArm'], 
                                null, null, 'J_Bip_L_Shoulder', 'J_Bip_L_LowerArm', 
                                [-0.10841912301092027 , 1.2718053069000002 , 0.005957500799999999],
                                [-0.3274257360109203 , 1.2616076674 , 0.004120150369999999], 
                                [0.7, 0.7]),
        'J_Bip_L_LowerArm' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_L_LowerArm'], 
                                null, null, 'J_Bip_L_UpperArm', 'J_Bip_L_Hand',
                                [-0.3274257360109203 , 1.2616076674 , 0.004120150369999999],
                                [-0.5409997730109203 , 1.261142035915 , -0.013509633230000002],
                                [0.7, 0.7]),
        'J_Bip_L_Hand' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_L_Hand'], 
                                null, null, 'J_Bip_L_LowerArm', null,
                                [-0.5409997730109203 , 1.261142035915 , -0.013509633230000002],
                                [-0.6073959655609202 , 1.269481560415 , -0.010418964830000002], 
                                [2, 2]),
        // Right Arm
        'J_Bip_R_Shoulder' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_R_Shoulder'], 
                                'J_Bip_C_Neck', 'J_Bip_C_UpperChest', 'J_Bip_R_UpperArm', 'J_Bip_L_Shoulder',
                                [0.02264680808907972 , 1.2866781000000003 , 0.011321204299999998],
                                [0.10894121808907972 , 1.2718081716000003 , 0.005957494299999999],
                                [1.0, 0.8]),
        'J_Bip_R_UpperArm' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_R_UpperArm'], 
                                null, null, 'J_Bip_R_LowerArm', 'J_Bip_R_Shoulder',
                                [0.10894121808907972 , 1.2718081716000003 , 0.005957494299999999],
                                [0.3279509180890797 , 1.2616107706000002 , 0.004120352489999999],
                                [0.7, 0.7]),
        'J_Bip_R_LowerArm' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_R_LowerArm'], 
                                null, null, 'J_Bip_R_Hand', 'J_Bip_R_UpperArm',
                                [0.3279509180890797 , 1.2616107706000002 , 0.004120352489999999],
                                [0.5415240760890797 , 1.2611457351610003 , -0.01350866371],
                                [0.7, 0.7]),
        'J_Bip_R_Hand' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_R_Hand'], 
                                null, null, null, 'J_Bip_R_LowerArm',
                                [0.5415240760890797 , 1.2611457351610003 , -0.01350866371],
                                [0.6079211480390797 , 1.2694844246610002 , -0.01041752959],
                                [2, 2]),

        'J_Bip_C_UpperChest' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_C_UpperChest'], 
                                'J_Bip_C_Neck', 'J_Bip_C_Chest', 'J_Bip_R_Shoulder', 'J_Bip_L_Shoulder',
                                [0.00026120528907972005 , 1.1994104600000002 , -0.0161215757],
                                [0.00026121113894972 , 1.3140256600000002 , 0.0172741021],
                                [1.0, 0.7]),
        'J_Bip_C_Chest' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_C_Chest'], 
                                'J_Bip_C_UpperChest', 'J_Bip_C_Spine', null, null,
                                [0.00026119847878339 , 1.075307629 , -0.0297645946],
                                [0.00026120528907972005 , 1.1994104600000002 , -0.0161215757],
                                [1.0, 0.7]),
        'J_Bip_C_Spine' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_C_Spine'], 
                                'J_Bip_C_Chest', 'J_Bip_C_Hips', null, null,
                                [0.00026121166281859 , 0.961319885 , -0.015595276000000002],
                                [0.00026119847878339 , 1.075307629 , -0.0297645946],
                                [1.0, 0.7]),
        'J_Bip_C_Hips' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_C_Hips'], 
                                'J_Bip_C_Spine', null, 'J_Bip_R_UpperLeg', 'J_Bip_L_UpperLeg',
                                [0.0002612176 , 0.9084061 , -0.005770652],
                                [0.00026121166281859 , 0.961319885 , -0.015595276000000002],
                                [1.5, 0.9]),
        // Left Leg
        'J_Bip_L_UpperLeg' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_L_UpperLeg'], 
                                'J_Bip_C_Hips', 'J_Bip_L_LowerLeg', 'J_Bip_R_UpperLeg', null,
                                [-0.0768611724 , 0.8684522125 , -0.0022693657400000003],
                                [-0.056595015799999995 , 0.5162622545 , 0.00405614971],
                                [0.7, 0.7]),
        'J_Bip_L_LowerLeg' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_L_LowerLeg'], 
                                'J_Bip_L_UpperLeg', 'J_Bip_L_Foot', 'J_Bip_L_LowerLeg', null,
                                [-0.056595015799999995 , 0.5162622545 , 0.00405614971],
                                [-0.046243875799999994 , 0.10161895449999997 , 0.02523070721],
                                [0.6, 0.7]),
        'J_Bip_L_Foot' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_L_Foot'], 
                                'J_Bip_L_LowerLeg', 'J_Bip_L_ToeBase', 'J_Bip_R_Foot', 'J_Bip_L_ToeBase',
                                [-0.046243875799999994 , 0.10161895449999997 , 0.02523070721],
                                [-0.04771013515999999 , 0.03825397449999997 , -0.08536691779], 
                                [1.0, 0.9]),
        'J_Bip_L_ToeBase' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_L_ToeBase'], 
                                'J_Bip_L_Foot', null, 'J_Bip_R_ToeBase', null,
                                [-0.04771013515999999 , 0.03825397449999997 , -0.08536691779],
                                [-0.048118345019999995 , 0.03623838382999997 , -0.13055422779],
                                [1.0, 1]),
        // Right Leg
        'J_Bip_R_UpperLeg' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_R_UpperLeg'], 
                                'J_Bip_C_Hips', 'J_Bip_R_LowerLeg', null, 'J_Bip_L_UpperLeg',
                                [0.0773835876 , 0.8684520337 , -0.00226935828],
                                [0.0571169653 , 0.5162624927 , 0.00405607522],
                                [0.7, 0.7]),
        'J_Bip_R_LowerLeg' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_R_LowerLeg'], 
                                'J_Bip_R_UpperLeg', 'J_Bip_R_Foot', null, 'J_Bip_R_LowerLeg',
                                [0.0571169653 , 0.5162624927 , 0.00405607522],
                                [0.0467650243 , 0.10161889270000002 , 0.02523081152],
                                [0.6, 0.7]),
        'J_Bip_R_Foot' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_R_Foot'], 
                                'J_Bip_R_LowerLeg', 'J_Bip_R_ToeBase', 'J_Bip_R_ToeBase', 'J_Bip_L_Foot',
                                [0.0467650243 , 0.10161889270000002 , 0.02523081152],
                                [0.04823067271 , 0.03825391270000002 , -0.08536681348],
                                [1.0, 0.9]),
        'J_Bip_R_ToeBase' : new SkeletonPropertyWithoutHand(
                                model_bone_list['J_Bip_R_ToeBase'], 
                                'J_Bip_R_Foot', null, null, 'J_Bip_L_ToeBase',
                                [0.04823067271 , 0.03825391270000002 , -0.08536681348],
                                [0.04863875591 , 0.036238202820000016 , -0.13055388348],
                                [1.0, 1])
    }
    return major_skeleton_list;
}

function create_skeleton_geometry(){
    const geometry = new THREE.Geometry();

    let t = new THREE.Mesh(new THREE.ConeGeometry( 0.15, 0.7, 6 ));
    t.rotation.x = Math.PI / 2;
    t.position.set(0, 0, 0.7/2 + 0.3);
    t.openEnded = true;
    geometry.mergeMesh(t);

    t = new THREE.Mesh(new THREE.ConeGeometry( 0.15, 0.3, 6 ));
    t.rotation.x = Math.PI + Math.PI / 2;
    t.position.set(0, 0, 0.3/2);
    t.openEnded = true;
    geometry.mergeMesh(t);

    t = new THREE.Mesh(new THREE.SphereGeometry( 0.1, 8, 8 ));
    geometry.mergeMesh(t);

    return geometry;
}

function create_skeleton_helper(model){
    let major_bone_helper_list = [];
    let major_bone_list = {};

    const geometry = create_skeleton_geometry();

    let major_skeleton_list = make_major_skeleton_list(model);
    const key = Object.keys(major_skeleton_list);
    for(let i = 0; i < key.length; ++i){
        const material = new THREE.MeshBasicMaterial( { 
            color: new THREE.Color( 0, 1, 0 ), 
            depthTest: false, 
            depthWrite: false, 
            transparent: true } );

        let major_bone = major_skeleton_list[key[i]];

        //const start_vector = new THREE.Vector3( 0 ,0 ,0 );
        const end_vector = new THREE.Vector3(
            major_bone.end_pos[0] - major_bone.start_pos[0],
            major_bone.end_pos[1] - major_bone.start_pos[1],
            major_bone.end_pos[2] - major_bone.start_pos[2] );

        const bone_line = new THREE.Mesh(geometry, material);
        bone_line.name = 'Skeleton_Helper';
        bone_line.root = model;

        let bone_length = end_vector.length();
        bone_line.scale.set(
            major_bone.scale[0] * bone_length,
            major_bone.scale[0] * bone_length,
            major_bone.scale[1] * bone_length );
        bone_line.lookAt(end_vector);
        bone_line.frustumCulled = false;

        major_bone.bone.add(bone_line);
        major_bone_helper_list.push(bone_line);
        major_bone_list[major_bone.bone.name] = major_bone.bone;

        // add axis
        //let axes = new THREE.AxesHelper(0.2);
        //major_bone.bone.add(axes);

    }
    model.major_bone_helper_list = major_bone_helper_list;
    model.major_bone_list = major_bone_list;
}





