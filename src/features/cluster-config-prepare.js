/**
 * File Name : cluster-config-prepare.js
 * Date Created : 2020.03.02
 * Writer  : 박동혁
 * Description : 클러스터 구성 준비 마법사 UI를 컨트롤하기 위한 스크립트
 **/

// 변수 선언
var cur_step_wizard_cluster_config_prepare = "1";
var option = "";
let HostProfileData = [];

// Document.ready 시작
$(document).ready(function () {
    // 마법사 페이지 준비
    $('#div-modal-wizard-cluster-config-cluster-type').hide();
    $('#div-modal-wizard-cluster-config-ssh-key').hide();
    $('#div-modal-wizard-cluster-config-ip-info').hide();
    $('#div-modal-wizard-cluster-config-time-server').hide();
    $('#div-modal-wizard-cluster-config-review').hide();
    $('#div-modal-wizard-cluster-config-deploy').hide();
    $('#div-modal-wizard-cluster-config-finish').hide();
    $('#div-form-hosts-file').hide();
    $('#div-form-hosts-table').hide();
    $('#span-timeserver2-required').hide();
    $('#span-timeserver3-required').hide();
    $('#div-accordion-ssh-key').hide();
    $('#div-accordion-cluster-type').hide();
    $('#div-accordion-hosts-file').hide();
    $('#div-accordion-timeserver').hide();

    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
    $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', true);

    $('#nav-button-cluster-config-overview').addClass('pf-m-current');

    checkHostName(option);
});

$('[name="cluster-config-cluster-type-card"]').click(function() {
    var $clickedButton = $(this);

    // 클릭한 버튼이 이미 선택되어 있는 경우, 선택을 해제하고 숨겨진 입력 값을 재설정합니다.
    if ($clickedButton.hasClass('is-selected')) {
        $clickedButton.removeClass('is-selected');
        $clickedButton.find('i').removeClass('fa-check');

        // 선택이 취소되었으므로 숨겨진 입력을 재설정합니다.
        $('#selected-cluster-type').val('');

    } else {
        // 다른 모든 버튼의 선택을 해제합니다.
        $('[name="cluster-config-cluster-type-card"]').removeClass('is-selected').each(function() {
            $(this).find('i').removeClass('fa-check');
        });

        // 클릭한 버튼을 선택하세요
        $clickedButton.addClass('is-selected');
        $clickedButton.find('i').addClass('fa-check').css('color', 'green');

        // 선택된 값을 숨겨진 입력으로 설정
        var selectedValue = $clickedButton.val();
        $('#selected-cluster-type').val(selectedValue);

    }
});

// 타이틀 닫기 버튼 이벤트 처리
$('#button-close-modal-wizard-cluster-config-prepare').on('click', function () {
    $('#div-modal-wizard-cluster-config-prepare').hide();
});

/* 마법사 사이드 메뉴 버튼 클릭 이벤트 처리 시작 */
$('#nav-button-cluster-config-overview').on('click', function () {
    resetClusterConfigWizard();

    $('#div-modal-wizard-cluster-config-overview').show();
    $('#nav-button-cluster-config-overview').addClass('pf-m-current');

    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
    $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', true);

    cur_step_wizard_cluster_config_prepare = "1";
});
$('#nav-button-cluster-config-cluster-type').on('click', function () {
    resetClusterConfigWizard();

    $('#div-modal-wizard-cluster-config-cluster-type').show();
    $('#nav-button-cluster-config-cluster-type').addClass('pf-m-current');

    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
    $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

    cur_step_wizard_cluster_config_prepare = "2";
});
$('#nav-button-cluster-config-ssh-key').on('click', function () {
    resetClusterConfigWizard();

    $('#div-modal-wizard-cluster-config-ssh-key').show();
    $('#nav-button-cluster-config-ssh-key').addClass('pf-m-current');

    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
    $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

    cur_step_wizard_cluster_config_prepare = "3";
});

$('#nav-button-cluster-config-ip-info').on('click', function () {
    resetClusterConfigWizard();

    $('#div-modal-wizard-cluster-config-ip-info').show();
    $('#nav-button-cluster-config-ip-info').addClass('pf-m-current');

    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
    $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

    screenConversion();

    var os_type = $('#selected-cluster-type').val();

    clusterConfigProfile(os_type,"reset");

    clusterConfigTableChange("form-input-cluster-config-host-number", "form-table-tbody-cluster-config-new-host-profile", os_type);

    cur_step_wizard_cluster_config_prepare = "4";
});

$('#nav-button-cluster-config-time-server').on('click', function () {
    resetClusterConfigWizard();


    $('#div-modal-wizard-cluster-config-time-server').show();
    $('#nav-button-cluster-config-time-server').addClass('pf-m-current');

    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
    $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
    var os_type = $('#selected-cluster-type').val();
    // 로컬 시간서버 설정 시 PN 아이피 주소 자동 입력
    if($('input[name=radio-timeserver]:checked').val() == "internal") {
        inputPnIntoTimeServer(os_type);
    }
    // 구성할 호스트 수가 3대 미만이면 로컬 시간 서버 비활성화
    // if($('#form-input-cluster-config-host-number').val() < 3) {
    //     $("input[name='radio-timeserver'][value='external']").prop("checked", true);
    //     $('#form-radio-timeserver-int').attr('disabled', true);
    //     $('#span-timeserver2-required').hide();
    //     $('#span-timeserver3-required').hide();
    //     $('#form-input-cluster-config-time-server-ip-2').removeAttr('required');
    //     // 현재 host radio 버튼 숨김
    //     $('#div-timeserver-host-num').hide();
    //     // radio 버튼 클릭 시 ip 정보 초기화
    //     $('input[name=form-input-cluster-config-timeserver]').val("");
    // }else {
    //     $('#form-radio-timeserver-int').attr('disabled', false);
    // }
    cur_step_wizard_cluster_config_prepare = "5";
});

$('#nav-button-cluster-config-review').on('click', function () {
    resetClusterConfigWizard();

    $('#div-modal-wizard-cluster-config-review').show();
    $('#nav-button-cluster-config-review').addClass('pf-m-current');

    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
    $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

    $('#button-next-step-modal-wizard-cluster-config-prepare').html('완료');
    cur_step_wizard_cluster_config_prepare = "6";

    // 변경된 키 내용을 설정 확인에 반영
    let ssh_key_type = $('input[name=radio-ssh-key]:checked').val();
    putSshKeyValueIntoTextarea(ssh_key_type);
    // 변경된 hosts file 내용을 설정 확인에 반영
    let host_file_type = $('input[name=radio-hosts-file]:checked').val();

    $("#div-cluster-ccvm-mngt-ip").text($("#form-input-cluster-ccvm-mngt-ip").val());
    $("#div-cluster-mngt-nic-cidr").text($("#form-input-cluster-mngt-nic-cidr").val());
    $("#div-cluster-mngt-nic-gw").text($("#form-input-cluster-mngt-nic-gateway").val());
    $("#div-cluster-mngt-nic-dns").text($("#form-input-cluster-mngt-nic-dns").val());
    $("#div-cluster-pcs-hostname1").text($("#form-input-cluster-pcs-hostname1").val());
    $("#div-cluster-pcs-hostname2").text($("#form-input-cluster-pcs-hostname2").val());
    $("#div-cluster-pcs-hostname3").text($("#form-input-cluster-pcs-hostname3").val());

    var os_type = $('#selected-cluster-type').val();
    putHostsValueIntoTextarea(host_file_type, option,os_type);
    // time server 내용을 설정 확인에 반영
    // 구성할 호스트 수가 3대 미만이면 로컬 시간 서버 비활성화
    // if($('#form-input-cluster-config-host-number').val() < 3) {
    //     $("input[name='radio-timeserver'][value='external']").prop("checked", true);
    //     $('#form-radio-timeserver-int').attr('disabled', true);
    //     $('#span-timeserver2-required').hide();
    //     $('#span-timeserver3-required').hide();
    //     $('#form-input-cluster-config-time-server-ip-2').removeAttr('required');
    //     // 현재 host radio 버튼 숨김
    //     $('#div-timeserver-host-num').hide();
    //     // radio 버튼 클릭 시 ip 정보 초기화
    //     $('input[name=form-input-cluster-config-timeserver]').val("");
    // }else {
    //     $('#form-radio-timeserver-int').attr('disabled', false);
    // }
    let timeserver_type = $('input[name=radio-timeserver]:checked').val();
    putTimeServerValueIntoTextarea(timeserver_type);
});

$('#nav-button-cluster-config-finish').on('click', function () {
    resetClusterConfigWizard();

    $('#div-modal-wizard-cluster-config-finish').show();
    $('#nav-button-cluster-config-finish').addClass('pf-m-current');

    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
    $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

    $('#button-next-step-modal-wizard-cluster-config-prepare').html('종료');

    cur_step_wizard_cluster_config_prepare = "7";

    // 변경된 키 내용을 설정 확인에 반영
    let ssh_key_type = $('input[name=radio-ssh-key]:checked').val();
    putSshKeyValueIntoTextarea(ssh_key_type);
    // 변경된 hosts file 내용을 설정 확인에 반영
    let host_file_type = $('input[name=radio-hosts-file]:checked').val();

    var os_type = $('#selected-cluster-type').val();
    putHostsValueIntoTextarea(host_file_type, option, os_type);
    // time server 내용을 설정 확인에 반영
    let ntp_timeserver_type = $('input[name=radio-timeserver]:checked').val();
    putTimeServerValueIntoTextarea(ntp_timeserver_type);
});

/* 마법사 사이드 메뉴 버튼 클릭 이벤트 처리 끝 */

/* 마법사 Footer 영역의 버튼 클릭 이벤트 처리 시작 */

$('#button-next-step-modal-wizard-cluster-config-prepare').on('click', function () {
    resetClusterConfigWizard();
    if (cur_step_wizard_cluster_config_prepare == "1"){
        $('#div-modal-wizard-cluster-config-cluster-type').show();
        $('#nav-button-cluster-config-cluster-type').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

        cur_step_wizard_cluster_config_prepare = "2";

    } else if (cur_step_wizard_cluster_config_prepare == "2") {

        $('#div-modal-wizard-cluster-config-ssh-key').show();
        $('#nav-button-cluster-config-ssh-key').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

        cur_step_wizard_cluster_config_prepare = "3";

    } else if (cur_step_wizard_cluster_config_prepare == "3") {

        var os_type = $('#selected-cluster-type').val();

        screenConversion();
        clusterConfigProfile(os_type,"reset");
        clusterConfigTableChange("form-input-cluster-config-host-number", "form-table-tbody-cluster-config-new-host-profile",os_type);
        $('#div-modal-wizard-cluster-config-ip-info').show();
        $('#nav-button-cluster-config-ip-info').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

        cur_step_wizard_cluster_config_prepare = "4";

    } else if (cur_step_wizard_cluster_config_prepare == "4") {
        let cluster_host_yn = $('input[name=radio-cluster-host]:checked').val();
        if (os_type == "ablestack-vm" && cluster_host_yn == "add"){
            $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', true);
        }

        $('#div-modal-wizard-cluster-config-time-server').show();
        $('#nav-button-cluster-config-time-server').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

        cur_step_wizard_cluster_config_prepare = "5";

        // 변경된 키 내용을 설정 확인에 반영
        let ssh_key_type = $('input[name=radio-ssh-key]:checked').val();
        putSshKeyValueIntoTextarea(ssh_key_type);
        // 변경된 hosts file 내용을 설정 확인에 반영
        let host_file_type = $('input[name=radio-hosts-file]:checked').val();

        $("#div-cluster-ccvm-mngt-ip").text($("#form-input-cluster-ccvm-mngt-ip").val());
        $("#div-cluster-mngt-nic-cidr").text($("#form-input-cluster-mngt-nic-cidr").val());
        $("#div-cluster-mngt-nic-gw").text($("#form-input-cluster-mngt-nic-gateway").val());
        $("#div-cluster-mngt-nic-dns").text($("#form-input-cluster-mngt-nic-dns").val());
        $("#div-cluster-pcs-hostname1").text($("#form-input-cluster-pcs-hostname1").val());
        $("#div-cluster-pcs-hostname2").text($("#form-input-cluster-pcs-hostname2").val());
        $("#div-cluster-pcs-hostname3").text($("#form-input-cluster-pcs-hostname3").val());

        var os_type = $('#selected-cluster-type').val();
        putHostsValueIntoTextarea(host_file_type, option, os_type);
        // time server 내용을 설정 확인에 반영
        let timeserver_type = $('input[name=radio-timeserver]:checked').val();
        putTimeServerValueIntoTextarea(timeserver_type);
        // 로컬 시간서버 설정 시 PN 아이피 주소 자동 입력
        if ($('input[name=radio-timeserver]:checked').val() == "internal") {
            inputPnIntoTimeServer(os_type);
        }
        if (os_type == "ablestack-vm" && cluster_host_yn == "add"){
            var ipmi_ip = $('#form-input-cluster-config-credentials-ipmi-ip').val();
            var ipmi_user = $('#form-input-cluster-config-credentials-ipmi-user').val();
            var ipmi_password = $('#form-input-cluster-config-credentials-ipmi-password').val();
            var ipmi_port = "623";

            var ipmi_config = `${ipmi_ip},${ipmi_port},${ipmi_user},${ipmi_password}`;

            console.log(ipmi_config);
            check_ipmi_cmd = ['python3',pluginpath + '/python/gfs/gfs_manage.py' , '--check-ipmi', '--stonith', ipmi_config];
            console.log(check_ipmi_cmd);
            cockpit.spawn(check_ipmi_cmd)
            .then(function(data) {
                var retVal = JSON.parse(data);
                console.log(retVal);
                if (retVal.code == "200"){
                    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
                    $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
                    $('#button-cancel-config-modal-wizard-cluster-config-prepare').attr('disabled', false);

                    cur_step_wizard_cloud_vm = "5";
                }else{
                    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', true);
                    cur_step_wizard_cloud_vm = "5";
                    alert(retVal.val.message + " 이전으로 돌아가 정확한 자격증명을 입력하시길 바랍니다.");
                }
            }).catch(function () {
                $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', true);
                cur_step_wizard_cloud_vm = "5";
                alert("이전으로 돌아가 정확한 자격증명을 입력하시길 바랍니다.");
            })
        }

    } else if (cur_step_wizard_cluster_config_prepare == "5") {
        $('#div-modal-wizard-cluster-config-review').show();
        $('#nav-button-cluster-config-review').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

        $('#button-next-step-modal-wizard-cluster-config-prepare').html('완료');
        cur_step_wizard_cluster_config_prepare = "6";

        // 변경된 키 내용을 설정 확인에 반영
        let ssh_key_type = $('input[name=radio-ssh-key]:checked').val();
        putSshKeyValueIntoTextarea(ssh_key_type);
        // 변경된 hosts file 내용을 설정 확인에 반영
        let host_file_type = $('input[name=radio-hosts-file]:checked').val();

        var os_type = $('#selected-cluster-type').val();
        putHostsValueIntoTextarea(host_file_type, option, os_type);
        // time server 내용을 설정 확인에 반영
        let timeserver_type = $('input[name=radio-timeserver]:checked').val();
        putTimeServerValueIntoTextarea(timeserver_type);

    } else if (cur_step_wizard_cluster_config_prepare == "6") {

        // 유효성 검증 후 완료 버튼을 누르면 선택한 내용대로 파일이 호스트에 저장
        let timeserver_type = $('input[name=radio-timeserver]:checked').val();
        var os_type = $('#selected-cluster-type').val();
        let cluster_config_prepare_vaildation = validateClusterConfigPrepare(timeserver_type,os_type);
        if (cluster_config_prepare_vaildation == true) {
            $('#div-modal-wizard-cluster-config-deploy').show();

            $('#nav-button-cluster-config-overview').addClass('pf-m-disabled');
            $('#nav-button-cluster-config-cluster-type').addClass('pf-m-disabled');
            $('#nav-button-cluster-config-ssh-key').addClass('pf-m-disabled');
            $('#nav-button-cluster-config-ip-info').addClass('pf-m-disabled');
            $('#nav-button-cluster-config-time-server').addClass('pf-m-disabled');
            $('#nav-button-cluster-config-review').addClass('pf-m-disabled');
            $('#button-before-step-modal-wizard-cluster-config-prepare').hide();
            $('#button-cancel-config-modal-wizard-cluster-config-prepare').hide();
            $('#button-next-step-modal-wizard-cluster-config-prepare').hide();
            $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
            $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

            setClusterProgressStep("span-cluster-progress-step1",1);

            // SSH Key 파일
            let radio_value = $('input[name=radio-ssh-key]:checked').val();
            putSshKeyValueIntoTextarea(radio_value);
            let pri_ssh_key_text = $('#div-textarea-cluster-config-confirm-ssh-key-pri-file').val();
            let pub_ssh_key_text = $('#div-textarea-cluster-config-confirm-ssh-key-pub-file').val();
            let file_type = "ssh_key";

            writeSshKeyFile(pri_ssh_key_text, pub_ssh_key_text, file_type);

            // hosts 파일 > config 파일 쓰는 부분
            let host_file_type = $('input[name=radio-hosts-file]:checked').val();

            let ret_json_string = tableToClusterConfigJsonString(host_file_type, option, os_type);

            // ccvm_mngt_ip
            var ccvm_mgmt_ip = $('#form-input-cluster-ccvm-mngt-ip').val();

            // 관리 NIC 정보
            var mngt_nic_cidr =  $("#form-input-cluster-mngt-nic-cidr").val();
            var mngt_nic_gateway = $("#form-input-cluster-mngt-nic-gateway").val();
            var mngt_nic_dns = $("#form-input-cluster-mngt-nic-dns").val();
            var extenal_timeserver = $("#form-input-cluster-config-external-time-server-ip").val();

            let host_names = [];
            // pcs 클러스터 구성할 호스트 1~3번 정보
            if (os_type == "ablestack-vm"){
                saveTableData(host_file_type);

                for (let i = 0; i < HostProfileData.length; i++) {
                    // 값이 비어 있거나 정의되지 않은 경우 빈 문자열로 설정
                    let name = HostProfileData[i];
                    if (name === "" || name === "undefined" || name === null || name === undefined) {
                        host_names.push(""); // 빈 값 추가
                    } else {
                        host_names.push(name.trim()); // 유효한 값 추가
                    }
                }

            }else{
                for (let i = 1; i <= 3; i++) {
                    let host_name = $(`#form-input-cluster-pcs-hostname${i}`).val() || ""; // 각 호스트 이름 가져오기
                    host_names.push(host_name.trim()); // 배열에 추가 (공백 제거)
                }
            }

            var console_log = true;
            // writeSshKeyFile 작업이 완료될떄까지 5초 delay
            setTimeout(function(){
                setClusterProgressStep("span-cluster-progress-step1",2);
                setClusterProgressStep("span-cluster-progress-step2",1);
                // 신규일때
                // writeConfigFile(ret_json_string);
                let cluster_host_yn = $('input[name=radio-cluster-host]:checked').val()
                if(cluster_host_yn == "new"){
                    var cluster_config_cmd = ["python3", pluginpath+"/python/cluster/cluster_config.py", "insert", "-t", os_type, "-js", ret_json_string, '-cmi', ccvm_mgmt_ip, '-ets', extenal_timeserver, '-pcl', ...host_names];
                    if(mngt_nic_cidr != ""){
                        cluster_config_cmd.push("-mnc",mngt_nic_cidr)
                    }
                    if(mngt_nic_gateway != ""){
                        cluster_config_cmd.push("-mng",mngt_nic_gateway)
                    }
                    if(mngt_nic_dns != ""){
                        cluster_config_cmd.push("-mnd",mngt_nic_dns)
                    }

                    if(console_log){console.log(cluster_config_cmd);}
                    cockpit.spawn(cluster_config_cmd)
                    .then(function(data){
                        var retVal = JSON.parse(data);
                        if(retVal.code == "200"){
                            setClusterProgressStep("span-cluster-progress-step2",2);
                            setClusterProgressStep("span-cluster-progress-step3",1);
                            // 해당 호스트의 수정된 cluster.json 파일을 다운로드 링크로 만드는 함수 호출
                            createClusterJsonLink();

                            // 마무리 작업 및 최종 화면 호출
                            showDivisionClusterConfigFinish();
                        }else{
                            // 실패
                            setClusterProgressFail(2);
                            createLoggerInfo(retVal.val);
                            alert(retVal.val);
                        }
                    })
                    .catch(function(data){
                        setClusterProgressFail(2);
                        createLoggerInfo(":::Please check the cluster.json file.:::");
                        console.log(":::Please check the cluster.json file.::: "+ data);
                    });
                }
                // 추가 호스트일때
                else if(cluster_host_yn == "add"){
                    let all_host_name = host_names.join(" ");
                    var exclude_hostname = $('#form-input-current-host-name').val();

                    if (os_type == "ablestack-vm"){
                        var ipmi_ip = $('#form-input-cluster-config-credentials-ipmi-ip').val();
                        var ipmi_user = $('#form-input-cluster-config-credentials-ipmi-user').val();
                        var ipmi_password = $('#form-input-cluster-config-credentials-ipmi-password').val();
                        var ipmi_port = "623";
                        var gfs_mount_point = "/mnt/glue-gfs";

                        var ipmi_config = `${ipmi_ip},${ipmi_port},${ipmi_user},${ipmi_password}`;

                        var host_ping_test_and_cluster_config_cmd = ['python3', pluginpath + '/python/cluster/cluster_config.py', 'insertAllHost', '-t' , os_type, '-js', ret_json_string, '-cmi', ccvm_mgmt_ip, '-pcl', ...host_names, '-eh', exclude_hostname];
                        if(mngt_nic_cidr != ""){
                            host_ping_test_and_cluster_config_cmd.push("-mnc",mngt_nic_cidr)
                        }
                        if(mngt_nic_gateway != ""){
                            host_ping_test_and_cluster_config_cmd.push("-mng",mngt_nic_gateway)
                        }
                        if(mngt_nic_dns != ""){
                            host_ping_test_and_cluster_config_cmd.push("-mnd",mngt_nic_dns)
                        }
                        if(extenal_timeserver != ""){
                            host_ping_test_and_cluster_config_cmd.push("-ets", extenal_timeserver)
                        }
                        if(console_log){console.log(host_ping_test_and_cluster_config_cmd);}
                        cockpit.spawn(host_ping_test_and_cluster_config_cmd)
                        .then(function(data){
                            var retVal = JSON.parse(data);
                            if(retVal.code == "200"){
                                var pcs_config_setting_cmd = ['python3', pluginpath + '/python/gfs/gfs_manage.py', '--extend-pcs-cluster', '--password', 'password', '--stonith', ipmi_config, '--mount-point', gfs_mount_point, '--list-ip', all_host_name];
                                console.log(pcs_config_setting_cmd);
                                cockpit.spawn(pcs_config_setting_cmd)
                                .then(function(data){
                                    var retVal = JSON.parse(data);
                                    if(retVal.code == "200"){
                                        setClusterProgressStep("span-cluster-progress-step2",2);
                                        setClusterProgressStep("span-cluster-progress-step3",1);
                                        var etc_config_cmd = ['python3', pluginpath + '/python/ablestack_json/ablestackJson.py', 'allUpdate'];
                                        if(console_log){console.log(etc_config_cmd);}
                                        cockpit.spawn(etc_config_cmd)
                                        .then(function(data){
                                            var retVal = JSON.parse(data);
                                            if(retVal.code == "200"){
                                                var set_alert_cmd = ['python3', pluginpath + '/python/gfs/gfs_manage.py', '--set-alert', '--list-ip', all_host_name];
                                                console.log(set_alert_cmd);
                                                cockpit.spawn(set_alert_cmd)
                                                .then(function(data){
                                                    var retVal = JSON.parse(data);
                                                    if(retVal.code == "200"){
                                                        setClusterProgressStep("span-cluster-progress-step3",2);
                                                        // 해당 호스트의 수정된 cluster.json 파일을 다운로드 링크로 만드는 함수 호출
                                                        createClusterJsonLink();

                                                        // 마무리 작업 및 최종 화면 호출
                                                        showDivisionClusterConfigFinish();
                                                    }else{
                                                        // 실패
                                                        setClusterProgressFail(3);
                                                        createLoggerInfo(retVal.val);
                                                        alert(retVal.val);
                                                    }
                                                })
                                                .catch(function(data){
                                                    setClusterProgressFail(3);
                                                    createLoggerInfo(":::Please check the pcs alert setup.:::");
                                                    console.log(":::Please check the pcs alert setup.::: "+ data);

                                                });
                                            }else{
                                                // 실패
                                                setClusterProgressFail(3);
                                                createLoggerInfo(retVal.val);
                                                alert(retVal.val);
                                            }
                                        })
                                        .catch(function(data){
                                            setClusterProgressFail(3);
                                            createLoggerInfo(":::Please check the ablestack.json file.:::");
                                            console.log(":::Please check the ablestack.json file.::: "+ data);
                                        });
                                    }else{
                                        // 실패
                                        setClusterProgressFail(2);
                                        createLoggerInfo(retVal.val);
                                        alert(retVal.val);
                                    }
                                })
                                .catch(function(data){
                                    setClusterProgressFail(2);
                                    createLoggerInfo(":::Please check the pcs config.:::");
                                    console.log(":::Please check the pcs config.::: "+ data);
                                });
                            }else{
                                setClusterProgressFail(1);
                                createLoggerInfo(retVal.val);
                                alert(retVal.val);
                            }
                        })
                        .catch(function(data){
                            setClusterProgressFail(2);
                            createLoggerInfo(":::Please check the cluster.json file.:::");
                            console.log(":::Please check the cluster.json file.::: "+ data);
                        });
                    }else{
                        var host_ping_test_and_cluster_config_cmd = ['python3', pluginpath + '/python/cluster/cluster_config.py', 'insertAllHost', '-t' , os_type,'-js', ret_json_string, '-cmi', ccvm_mgmt_ip, '-pcl', ...host_names, '-eh', exclude_hostname];
                        if(mngt_nic_cidr != ""){
                            host_ping_test_and_cluster_config_cmd.push("-mnc",mngt_nic_cidr)
                        }
                        if(mngt_nic_gateway != ""){
                            host_ping_test_and_cluster_config_cmd.push("-mng",mngt_nic_gateway)
                        }
                        if(mngt_nic_dns != ""){
                            host_ping_test_and_cluster_config_cmd.push("-mnd",mngt_nic_dns)
                        }
                        if(extenal_timeserver != ""){
                            host_ping_test_and_cluster_config_cmd.push("-ets", extenal_timeserver)
                        }
                        if(console_log){console.log(host_ping_test_and_cluster_config_cmd);}
                        cockpit.spawn(host_ping_test_and_cluster_config_cmd)
                        .then(function(data){
                            var retVal = JSON.parse(data);
                            if(retVal.code == "200"){
                                setClusterProgressStep("span-cluster-progress-step2",2);
                                setClusterProgressStep("span-cluster-progress-step3",1);

                                var etc_config_cmd = ['python3', pluginpath + '/python/ablestack_json/ablestackJson.py', 'allUpdate'];
                                if(console_log){console.log(etc_config_cmd);}
                                cockpit.spawn(etc_config_cmd)
                                .then(function(data){
                                    var retVal = JSON.parse(data);
                                    if(retVal.code == "200"){
                                        setClusterProgressStep("span-cluster-progress-step3",2);
                                        // 해당 호스트의 수정된 cluster.json 파일을 다운로드 링크로 만드는 함수 호출
                                        createClusterJsonLink();

                                        // 마무리 작업 및 최종 화면 호출
                                        showDivisionClusterConfigFinish();
                                    }else{
                                        // 실패
                                        setClusterProgressFail(3);
                                        createLoggerInfo(retVal.val);
                                        alert(retVal.val);
                                    }
                                })
                                .catch(function(data){
                                    setClusterProgressFail(3);
                                    createLoggerInfo(":::Please check the ablestack.json file.:::");
                                    console.log(":::Please check the ablestack.json file.::: "+ data);
                                });
                            }else{
                                // 실패
                                setClusterProgressFail(2);
                                createLoggerInfo(retVal.val);
                                alert(retVal.val);
                            }
                        })
                        .catch(function(data){
                            setClusterProgressFail(2);
                            createLoggerInfo(":::Please check the cluster.json file.:::");
                            console.log(":::Please check the cluster.json file.::: "+ data);
                        });
                    }
                }
            }, 5000);
        } else {
            $('#button-next-step-modal-wizard-cluster-config-prepare').html('완료');
            $('#div-modal-wizard-cluster-config-review').show();
            $('#nav-button-cluster-config-review').addClass('pf-m-current');
            $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
            $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
            cur_step_wizard_cluster_config_prepare = "7";
        }
    } else if (cur_step_wizard_cluster_config_prepare == "7") {
        resetClusterConfigWizard();
        resetClusterConfigWizardWithData();
        cur_step_wizard_cluster_config_prepare = "1";
        // 페이지 새로고침
        location.reload();
    }
});


$('#button-before-step-modal-wizard-cluster-config-prepare').on('click', function () {
    resetClusterConfigWizard();

    if (cur_step_wizard_cluster_config_prepare == "2") {
        $('#div-modal-wizard-cluster-config-overview').show();
        $('#nav-button-cluster-config-overview').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', true);

        cur_step_wizard_cluster_config_prepare = "1";
    }else if (cur_step_wizard_cluster_config_prepare == "3") {
        $('#div-modal-wizard-cluster-config-cluster-type').show();
        $('#nav-button-cluster-config-cluster-type').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

        cur_step_wizard_cluster_config_prepare = "2";
    }else if (cur_step_wizard_cluster_config_prepare == "4") {
        $('#div-modal-wizard-cluster-config-ssh-key').show();
        $('#nav-button-cluster-config-ssh-key').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

        cur_step_wizard_cluster_config_prepare = "3";

    } else if (cur_step_wizard_cluster_config_prepare == "5") {
        $('#div-modal-wizard-cluster-config-ip-info').show();
        $('#nav-button-cluster-config-ip-info').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

        cur_step_wizard_cluster_config_prepare = "4";
    } else if (cur_step_wizard_cluster_config_prepare == "6") {


        $('#div-modal-wizard-cluster-config-time-server').show();
        $('#nav-button-cluster-config-time-server').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

        cur_step_wizard_cluster_config_prepare = "5";
    } else if (cur_step_wizard_cluster_config_prepare == "7") {
        $('#div-modal-wizard-cluster-config-review').show();
        $('#nav-button-cluster-config-review').addClass('pf-m-current');

        $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
        $('#button-before-step-modal-wizard-cluster-config-prepare').attr('disabled', false);

        $('#nav-button-cluster-config-finish').addClass('pf-m-disabled');
        cur_step_wizard_cluster_config_prepare = "6";
    }
});

/* 마법사 Footer 영역의 버튼 클릭 이벤트 처리 끝 */

/* HTML Object에서 발생하는 이벤트 처리 시작 */

// SSH Key 준비 방법 중 신규 생성을 클릭하는 경우 SSH Key 파일 항목을 비활성화함
$('#form-radio-ssh-key-new').on('click', function () {
    $('#form-input-cluster-config-ssh-key-pri-file').attr('disabled', true);
    $('#form-input-cluster-config-ssh-key-pub-file').attr('disabled', true);
});

// SSH Key 준비 방법 중 기존 파일 사용을 클릭하는 경우 SSH Key 파일 항목을 활성화함
$('#form-radio-ssh-key-file').on('click', function () {
    $('#form-input-cluster-config-ssh-key-pri-file').attr('disabled', false);
    $('#form-input-cluster-config-ssh-key-pub-file').attr('disabled', false);
    $('#button-next-step-modal-wizard-cluster-config-prepare').attr('disabled', false);
});

// Host 파일 준비 방법 중 신규생성을 클릭하는 경우 Host 프로파일 디비전을 보여주고 Hosts 파일 디비전은 숨긴다.
$('#form-radio-hosts-new').on('click', function () {
    $('#div-form-hosts-profile').show();
    $('#div-form-hosts-file').hide();
    $('#div-form-hosts-table').hide();
    $('#div-form-hosts-input-number').show();
    $('#div-form-hosts-input-current-number').show();
    screenConversion();
    // "기존 파일 사용"에서 "신규 생성"을 클릭하면 초기화 된다.
    $("#form-table-tbody-cluster-config-new-host-profile").empty();
    var os_type = $('#selected-cluster-type').val();
    clusterConfigProfile(os_type,"reset");
    clusterConfigTableChange("form-input-cluster-config-host-number", "form-table-tbody-cluster-config-new-host-profile",os_type);
    // $('#form-input-cluster-config-current-host-number').val(1);
    $('#form-input-cluster-config-host-number-plus').removeAttr('disabled');
    $('#form-input-cluster-config-host-number-minus').removeAttr('disabled');
    $('#form-input-cluster-config-host-number').removeAttr('disabled');
    $('#form-table-tbody-cluster-config-existing-host-profile tr').remove();
    $('#form-input-cluster-config-hosts-file').val("");


    $("#form-input-cluster-ccvm-mngt-ip").val("");
    $("#form-input-cluster-mngt-nic-cidr").val("");
    $("#form-input-cluster-mngt-nic-gateway").val("");
    $("#form-input-cluster-mngt-nic-dns").val("");
    $("#form-input-cluster-pcs-hostname1").val("");
    $("#form-input-cluster-pcs-hostname2").val("");
    $("#form-input-cluster-pcs-hostname3").val("");

    $("#form-input-cluster-ccvm-mngt-ip").attr('disabled', false);
    $("#form-input-cluster-mngt-nic-cidr").attr('disabled', false);
    $("#form-input-cluster-mngt-nic-gateway").attr('disabled', false);
    $("#form-input-cluster-mngt-nic-dns").attr('disabled', false);
    $("#form-input-cluster-pcs-hostname1").attr('disabled', false);
    $("#form-input-cluster-pcs-hostname2").attr('disabled', false);
    $("#form-input-cluster-pcs-hostname3").attr('disabled', false);
});

// Host 파일 준비 방법 중 기존 파일 사용을 클릭하는 경우 Host 프로파일 디비전을 숨기고 Hosts 파일 디비전은 보여준다.
$('#form-radio-hosts-file').on('click', function () {
    $('#div-form-hosts-profile').hide();
    $('#div-form-hosts-file').show();
    $('#div-form-hosts-table').show();
    $('#div-form-hosts-input-number').show();
    $('#div-form-hosts-input-current-number').show();
    $('#form-input-cluster-config-host-number').val(0);
    $("#form-table-tbody-cluster-config-existing-host-profile").empty();
    var os_type = $('#selected-cluster-type').val();
    clusterConfigProfile(os_type,"reset");
    clusterConfigTableChange("form-input-cluster-config-host-number", "form-table-tbody-cluster-config-existing-host-profile",os_type);
    // $('#form-input-cluster-config-current-host-number').val(1);
    $('#form-input-cluster-config-host-number-plus').attr('disabled', true);
    $('#form-input-cluster-config-host-number-minus').attr('disabled', true);
    $('#form-input-cluster-config-host-number').attr('disabled', true);
    $('#form-input-cluster-config-hosts-file').val("");

    $("#form-input-cluster-ccvm-mngt-ip").val("");
    $("#form-input-cluster-mngt-nic-cidr").val("");
    $("#form-input-cluster-mngt-nic-gateway").val("");
    $("#form-input-cluster-mngt-nic-dns").val("");
    $("#form-input-cluster-pcs-hostname1").val("");
    $("#form-input-cluster-pcs-hostname2").val("");
    $("#form-input-cluster-pcs-hostname3").val("");
    $("#form-input-cluster-ccvm-mngt-ip").attr('disabled', true);
    $("#form-input-cluster-mngt-nic-cidr").attr('disabled', true);
    $("#form-input-cluster-mngt-nic-gateway").attr('disabled', true);
    $("#form-input-cluster-mngt-nic-dns").attr('disabled', true);
    $("#form-input-cluster-pcs-hostname1").attr('disabled', true);
    $("#form-input-cluster-pcs-hostname2").attr('disabled', true);
    $("#form-input-cluster-pcs-hostname3").attr('disabled', true);
});

$('#form-radio-cluster-host-new').on('click', function () {
    $('#form-radio-hosts-new').attr('disabled', false);
    if ($('#selected-cluster-type').val() == "ablestack-vm"){
        $('[name="cluster-config-ccvm-info"]').show();
        $('[name="cluster-config-ipmi-info"]').hide();
    }else{
        $('[name="cluster-config-ccvm-info"]').show();
        $('[name="cluster-config-ipmi-info"]').hide();
    }

    $('#form-radio-hosts-new').click();
});

$('#form-radio-cluster-host-add').on('click', function () {
    $('#form-radio-hosts-new').attr('disabled', true);
    if ($('#selected-cluster-type').val() == "ablestack-vm"){
        $('[name="cluster-config-ccvm-info"]').hide();
        $('[name="cluster-config-ipmi-info"]').show();
    }else{
        $('[name="cluster-config-ccvm-info"]').show();
        $('[name="cluster-config-ipmi-info"]').hide();
    }
    $('#form-radio-hosts-file').click();
});

// Host 파일 준비 중 "구성할 호스트"를 변경하는 '+', '-' 기능
$('#form-input-cluster-config-host-number-plus').on('click', function () {
    let num = $("#form-input-cluster-config-host-number").val();
    var os_type = $('#selected-cluster-type').val();

    $("#form-input-cluster-config-host-number").val(num * 1 + 1);
    clusterConfigProfile(os_type,"reset");
    clusterConfigTableChange("form-input-cluster-config-host-number", "form-table-tbody-cluster-config-new-host-profile",os_type);
});
$('#form-input-cluster-config-host-number-minus').on('click', function () {

    var os_type = $('#selected-cluster-type').val();

    if (os_type == "ablestack-vm"){
        let num = $("#form-input-cluster-config-host-number").val();
        $('#form-input-cluster-config-host-number').val(num * 1 - 1)
        clusterConfigProfile(os_type,"reset");
        clusterConfigTableChange("form-input-cluster-config-host-number", "form-table-tbody-cluster-config-new-host-profile",os_type);
    }else{
        let num = $("#form-input-cluster-config-host-number").val();
        if(num > 3){
            $('#form-input-cluster-config-host-number').val(num * 1 - 1)
            clusterConfigProfile(os_type,"reset");
            clusterConfigTableChange("form-input-cluster-config-host-number", "form-table-tbody-cluster-config-new-host-profile",os_type);
        }
    }
});

$('#form-input-cluster-config-host-number').on('change', function () {
    var os_type = $('#selected-cluster-type').val();

    if (os_type != "ablestack-vm"){
        if (this.value < 3 || this.value > 99) {
            this.value = 3;
            alert("3~99까지의 숫자만 입력할 수 있습니다.")
            clusterConfigProfile(os_type,"reset");
            clusterConfigTableChange("form-input-cluster-config-host-number", "form-table-tbody-cluster-config-new-host-profile",os_type);
            return;
        } else {
            clusterConfigProfile(os_type,"reset");
            clusterConfigTableChange("form-input-cluster-config-host-number", "form-table-tbody-cluster-config-new-host-profile",os_type);
        }
    }
});

// 로컬 시간서버를 외부 시간서버로 선택하면 시간서버 2, 3은 선택 입력으로 전환한다.
// $('#form-radio-timeserver-ext').on('click', function () {
//     $('#span-timeserver2-required').hide();
//     $('#span-timeserver3-required').hide();
//     $('#form-input-cluster-config-time-server-ip-2').removeAttr('required');
//     // 현재 host radio 버튼 숨김
//     $('#div-timeserver-host-num').hide();
//     $('#form-input-cluster-config-int-to-ext').hide();
//     // radio 버튼 클릭 시 ip 정보 초기화
//     $('input[name=form-input-cluster-config-timeserver]').val("");
// });

// 외부 시간서버를 로컬 시간서버로 선택하면 시간서버 2, 3은 필수 입력으로 전환한다.
$('#form-radio-timeserver-int').on('click', function () {
    $('#span-timeserver2-required').show();
    $('#span-timeserver3-required').show();
    $('#form-input-cluster-config-time-server-ip-2').attr('required', 'required');
    // 현재 host radio 버튼 보임
    // $('#div-timeserver-host-num').show();
    var os_type = $('#selected-cluster-type').val();
    inputPnIntoTimeServer(os_type);
    // $('input[name=form-input-cluster-config-timeserver]').val("");
    // PN 아이피 주소 자동 입력
});

// 아코디언 개체의 버튼 클릭 이벤트 처리
$('#button-accordion-cluster-type').on('click', function () {
    if ($('#button-accordion-cluster-type').attr("aria-expanded") == "false") {
        $('#button-accordion-cluster-type').attr("aria-expanded", "true");
        $('#button-accordion-cluster-type').addClass("pf-m-expanded");
        $('#div-accordion-cluster-type').fadeIn();
        $('#div-accordion-cluster-type').addClass("pf-m-expanded");
        // 설정확인에서 클러스터 종류 넣기
        $('#div-accordion-cluster-type-type').text($('[name="cluster-config-cluster-type-card"].is-selected').find('p:first').text());
    } else {
        $('#button-accordion-cluster-type').attr("aria-expanded", "false");
        $('#button-accordion-cluster-type').removeClass("pf-m-expanded");
        $('#div-accordion-cluster-type').fadeOut();
        $('#div-accordion-cluster-type').removeClass("pf-m-expanded");
        // 설정확인에서 클러스터 종류 넣기
        $('#div-accordion-cluster-type-type').text($('[name="cluster-config-cluster-type-card"].is-selected').find('p:first').text());
    }
});

$('#button-accordion-ssh-key').on('click', function () {
    if ($('#button-accordion-ssh-key').attr("aria-expanded") == "false") {
        $('#button-accordion-ssh-key').attr("aria-expanded", "true");
        $('#button-accordion-ssh-key').addClass("pf-m-expanded");
        $('#div-accordion-ssh-key').fadeIn();
        $('#div-accordion-ssh-key').addClass("pf-m-expanded");

    } else {
        $('#button-accordion-ssh-key').attr("aria-expanded", "false");
        $('#button-accordion-ssh-key').removeClass("pf-m-expanded");
        $('#div-accordion-ssh-key').fadeOut();
        $('#div-accordion-ssh-key').removeClass("pf-m-expanded");
    }
});

$('#button-accordion-hosts-file').on('click', function () {
    if ($('#button-accordion-hosts-file').attr("aria-expanded") == "false") {
        $('#button-accordion-hosts-file').attr("aria-expanded", "true");
        $('#button-accordion-hosts-file').addClass("pf-m-expanded");
        $('#div-accordion-hosts-file').fadeIn();
        $('#div-accordion-hosts-file').addClass("pf-m-expanded");
    } else {
        $('#button-accordion-hosts-file').attr("aria-expanded", "false");
        $('#button-accordion-hosts-file').removeClass("pf-m-expanded");
        $('#div-accordion-hosts-file').fadeOut();
        $('#div-accordion-hosts-file').removeClass("pf-m-expanded");
    }
});

$('#button-accordion-timeserver').on('click', function () {
    if ($('#button-accordion-timeserver').attr("aria-expanded") == "false") {
        $('#button-accordion-timeserver').attr("aria-expanded", "true");
        $('#button-accordion-timeserver').addClass("pf-m-expanded");
        $('#div-accordion-timeserver').fadeIn();
        $('#div-accordion-timeserver').addClass("pf-m-expanded");
    } else {
        $('#button-accordion-timeserver').attr("aria-expanded", "false");
        $('#button-accordion-timeserver').removeClass("pf-m-expanded");
        $('#div-accordion-timeserver').fadeOut();
        $('#div-accordion-timeserver').removeClass("pf-m-expanded");
    }
});

// ssh-key 클러스터 구성 준비 마법사가 시작되면 ssh key키를 생성하고 읽어와 hidden 처리된 textarea에 저장
// $('#button-open-modal-wizard-storage-cluster').on('click', function () {
//     readSshKeyFile();
// });

// ssh-key 기존 파일 선택 시 hidden textarea 내용을 선택한 파일의 내용으로 변경
$('#form-input-cluster-config-ssh-key-pri-file').on('click', function () {
    let ssh_key_input_pri = document.querySelector('#form-input-cluster-config-ssh-key-pri-file');
    let ssh_key_textarea_existing_pri = "div-textarea-cluster-config-temp-existing-ssh-key-pri-file";
    let file_type = "pri-ssh_key";
    fileReaderFunc(ssh_key_input_pri, ssh_key_textarea_existing_pri, file_type);
});
$('#form-input-cluster-config-ssh-key-pub-file').on('click', function () {
    let ssh_key_input_pub = document.querySelector('#form-input-cluster-config-ssh-key-pub-file');
    let ssh_key_textarea_existing_pub = "div-textarea-cluster-config-temp-existing-ssh-key-pub-file";
    let file_type = "pub-ssh_key";
    fileReaderFunc(ssh_key_input_pub, ssh_key_textarea_existing_pub, file_type);
});

// ssh-key 기존 파일 선택 시 파일 선택 취소 시 hidden textarea 초기화
$('#form-input-cluster-config-ssh-key-pri-file').on('change', function () {
    if ($(this).val() == "") {
        $('#div-textarea-cluster-config-temp-existing-ssh-key-pri-file').val("");
    }
});
$('#form-input-cluster-config-ssh-key-pub-file').on('change', function () {
    if ($(this).val() == "") {
        $('#div-textarea-cluster-config-temp-existing-ssh-key-pub-file').val("");
    }
});
// ssh-key input, hidden textarea 초기화
$('input[name=radio-ssh-key]').on('click', function () {
    if ($(this).val() == "new") {
        $('#form-input-cluster-config-ssh-key-pri-file').val("");
        $('#form-input-cluster-config-ssh-key-pub-file').val("");
        $('#div-textarea-cluster-config-temp-existing-ssh-key-pri-file').val("");
        $('#div-textarea-cluster-config-temp-existing-ssh-key-pub-file').val("");
    }
});

// Hosts 기존 파일 선택 시 hidden textarea 내용을 선택한 파일의 내용으로 변경
$('#form-input-cluster-config-hosts-file').on('click', function () {
    let hosts_input = document.querySelector('#form-input-cluster-config-hosts-file');
    let file_type = "cluster.json";
    var os_type = $("#selected-cluster-type").val();
    fileReaderIntoTableFunc(hosts_input, file_type, option,os_type);
    $('#form-input-cluster-config-hosts-file').val("")
});
// Hosts 기존 파일 선택 시, 파일 선택 취소 시 table 초기화
$('#form-input-cluster-config-hosts-file').on('change', function () {
    if ($(this).val() == "") {
        $('#form-table-tbody-cluster-config-existing-host-profile tr').remove();
    }
});

// 설정확인에서 버튼 클릭 시 파일 읽어오기
// SSH KEY 준비 방식에 따라 키 내용 보여주기
$('#button-accordion-ssh-key').on('click change', function () {
    let ssh_key_type = $('input[name=radio-ssh-key]:checked').val();
    putSshKeyValueIntoTextarea(ssh_key_type);
});
// hosts 파일 준비 방식에 따라 내용 보여주기
$('#button-accordion-hosts-file').on('click change', function () {
    let hosts_file_type = $('input[name=radio-hosts-file]:checked').val();
    var os_type = $('#selected-cluster-type').val();

    putHostsValueIntoTextarea(host_file_type, option, os_type);
});
// time server 종류에 따라 내용 보여주기
$('#button-accordion-timeserver').on('click change', function () {
    let timeserver_type = $('input[name=radio-timeserver]:checked').val();
    putTimeServerValueIntoTextarea(timeserver_type);
});

// 완료 단계에서 파일 다운로드 링크 생성
// SSH Key 다운로드 링크 생성
$('#span-modal-wizard-cluster-config-finish-pri-sshkey-download').on('click', function () {
    let ssh_key_type = $('input[name=radio-ssh-key]:checked').val();
    putSshKeyValueIntoTextarea(ssh_key_type);

    let pri_ssh_key_text = $('#div-textarea-cluster-config-confirm-ssh-key-pri-file').val();
    let pri_ssh_key_download_link_id = 'span-modal-wizard-cluster-config-finish-pri-sshkey-download';
    // 다운로드 링크 생성 전 유효성 검정
    if (pri_ssh_key_text.trim() != "") {
        saveAsFile(pri_ssh_key_download_link_id, pri_ssh_key_text, "id_rsa");
    } else {
        alert("SSH 개인 키 파일 정보를 입력해 주세요.");
    }
});
$('#span-modal-wizard-cluster-config-finish-pub-sshkey-download').on('click', function () {
    let ssh_key_type = $('input[name=radio-ssh-key]:checked').val();
    putSshKeyValueIntoTextarea(ssh_key_type);

    let pub_ssh_key_text = $('#div-textarea-cluster-config-confirm-ssh-key-pub-file').val();
    let pub_ssh_key_download_link_id = 'span-modal-wizard-cluster-config-finish-pub-sshkey-download';
    // 다운로드 링크 생성 전 유효성 검정
    if (pub_ssh_key_text.trim() != "") {
        saveAsFile(pub_ssh_key_download_link_id, pub_ssh_key_text, "id_rsa.pub");
    } else {
        alert("SSH 공개 키 파일 정보를 입력해 주세요.");
    }
});


// cluster.json 다운로드 링크 생성
$('#span-modal-wizard-cluster-config-finish-hosts-file-download').on('click', function () {
    let configtext = $('#div-textarea-cluster-config-confirm-json-conf').val();

    let hosts_download = 'span-modal-wizard-cluster-config-finish-hosts-file-download';
    // 다운로드 링크 생성 전 유효성 검정
    if (configtext != "" && configtext != null) {
        saveAsFile(hosts_download, configtext, "cluster.json");
    } else {
        alert("cluster.json 파일이 존재하지 않습니다.");
    }
});

function createClusterJsonLink(){
    let conf_file_path = pluginpath+ "/tools/properties/cluster.json";

    cockpit.file(conf_file_path).read()
    .done(function (content) {
        $('#div-textarea-cluster-config-confirm-json-conf').val(content);
    }).fail(function (error) {
        alert(error);
    });
}

/* HTML Object에서 발생하는 이벤트 처리 끝 */


/* cluster cancel modal 관련 action 시작 */

// 마법사 "취소 버튼 모달창" show, hide
$('#button-cancel-config-modal-wizard-cluster-config-prepare').on('click', function () {
    $('#div-modal-cancel-cluster-config-prepare-cancel').show();
});
$('#button-close-modal-cluster-config-prepare-cancel').on('click', function () {
    $('#div-modal-cancel-cluster-config-prepare-cancel').hide();
});
$('#button-cancel-modal-cluster-config-prepare-cancel').on('click', function () {
    $('#div-modal-cancel-cluster-config-prepare-cancel').hide();
});
// 마법사 "취소 버튼 모달창" 실행 버튼을 눌러 취소를 실행
$('#button-execution-modal-cluster-config-prepare-cancel').on('click', function () {
    resetClusterConfigWizard();
    resetClusterConfigWizardWithData();
    $('#div-modal-cancel-cluster-config-prepare-cancel').hide();
    cur_step_wizard_cluster_config_prepare = "1";
});

/* cluster cancel modal 관련 action 끝 */

/**
 * Meathod Name : resetClusterConfigWizard
 * Date Created : 2021.03.03
 * Writer  : 박동혁
 * Description : 마법사 대화상자의 화면 위치 및 사이드 메뉴의 위치를 초기화 하는 함수
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.03.03 최초 작성
 **/

function resetClusterConfigWizard() {
    $('#nav-button-cluster-config-overview').removeClass('pf-m-current');
    $('#nav-button-cluster-config-cluster-type').removeClass('pf-m-current');
    $('#nav-button-cluster-config-ssh-key').removeClass('pf-m-current');
    $('#nav-button-cluster-config-ip-info').removeClass('pf-m-current');
    $('#nav-button-cluster-config-time-server').removeClass('pf-m-current');
    $('#nav-button-cluster-config-review').removeClass('pf-m-current');
    $('#nav-button-cluster-config-finish').removeClass('pf-m-current');

    $('#div-modal-wizard-cluster-config-overview').hide();
    $('#div-modal-wizard-cluster-config-cluster-type').hide();
    $('#div-modal-wizard-cluster-config-ssh-key').hide();
    $('#div-modal-wizard-cluster-config-ip-info').hide();
    $('#div-modal-wizard-cluster-config-time-server').hide();
    $('#div-modal-wizard-cluster-config-review').hide();
    $('#div-modal-wizard-cluster-config-deploy').hide();
    $('#div-modal-wizard-cluster-config-finish').hide();

    $('#button-next-step-modal-wizard-cluster-config-prepare').html('다음');
}


/**
 * Meathod Name : resetClusterConfigWizardWithData
 * Date Created : 2021.03.30
 * Writer  : 류홍욱
 * Description : 마법사 대화상자에서 취소 및 완료를 클릭하면 화면 위치 및 사이드 메뉴의 위치, 입력된 데이터를 초기화하는 함수.
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.03.30 최초 작성
 **/
async function resetClusterConfigWizardWithData() {

    // 입력된 모든 데이터를 초기화한다.
    $('#nav-button-cluster-config-overview').addClass('pf-m-current');
    $('#nav-button-cluster-config-cluster-type').removeClass('pf-m-current');
    $('#nav-button-cluster-config-ssh-key').removeClass('pf-m-current');
    $('#nav-button-cluster-config-ip-info').removeClass('pf-m-current');
    $('#nav-button-cluster-config-time-server').removeClass('pf-m-current');
    $('#nav-button-cluster-config-review').removeClass('pf-m-current');
    $('#nav-button-cluster-config-finish').removeClass('pf-m-current');
    $('#div-modal-wizard-cluster-config-overview').show();
    // ssh-key
    $('#form-radio-ssh-key-new').prop('checked', true);
    $('#form-radio-ssh-key-file').prop('checked', false);
    $('#form-input-cluster-config-ssh-key-pri-file').attr('disabled', true);
    $('#form-input-cluster-config-ssh-key-pub-file').attr('disabled', true);
    $('input[name=form-input-cluster-config-ssh-key-file]').val("");
    $('textarea[name=div-textarea-cluster-config-temp-new-ssh-key-file]').val("");
    $('textarea[name=div-textarea-cluster-config-temp-existing-ssh-key-file]').val("");
    cockpit.script(["rm -f /root/.ssh/temp_id_rsa"])
    cockpit.script(["rm -f /root/.ssh/temp_id_rsa.pub"])
    // hosts
    $('#form-radio-hosts-new').prop('checked', true);
    $('#form-radio-hosts-new').removeAttr('disabled');
    $('#form-radio-hosts-file').prop('checked', false);
    $('#form-radio-cluster-host-new').prop('checked', true);
    $('#form-radio-cluster-host-add').prop('checked', false);
    $('#form-input-cluster-config-hosts-file').val("");
    $('#form-textarea-cluster-config-existing-host-profile').val("");
    $('#div-form-hosts-profile').show();
    $('#div-form-hosts-file').hide();
    $('#div-form-hosts-table').hide();
    $('#div-form-hosts-input-number').show();
    $('#div-form-hosts-input-current-number').show();
    // hosts 입력 테이블 초기화
    $('#form-table-tbody-cluster-config-new-host-profile tr').remove();
    $('#form-table-tbody-cluster-config-existing-host-profile tr').remove();
    var os_type = $('#selected-cluster-type').val();
    screenConversion();
    clusterConfigTableChange("form-input-cluster-config-host-number", "form-table-tbody-cluster-config-new-host-profile",os_type);
    $('#form-input-cluster-config-host-number-plus').removeAttr('disabled');
    $('#form-input-cluster-config-host-number-minus').removeAttr('disabled');
    $('#form-input-cluster-config-host-number').removeAttr('disabled');

    // 클러스터 종류
    $('#selected-cluster-type').val("");
    $('[name="cluster-config-cluster-type-card"]').removeClass('is-selected').each(function() {
        $(this).find('i').removeClass('fa-check');
    });

    // IP 정보
    clusterConfigProfile(os_type,"reset");

    // 시간 서버
    // $('#form-radio-timeserver-ext').prop('checked', true);
    $('#form-radio-timeserver-int').prop('checked', true);
    $('input[name=form-input-cluster-config-timeserver]').val("");
    // $('#div-timeserver-host-num').hide();
    $('#form-radio-timeserver-host-num-1').prop('checked', true);
    $('#form-radio-timeserver-host-num-2').prop('checked', false);
    $('#form-radio-timeserver-host-num-3').prop('checked', false);
    // 설정확인
    $('#button-accordion-cluster-type').attr("aria-expanded", "false");
    $('#button-accordion-cluster-type').removeClass("pf-m-expanded");
    $('#div-accordion-cluster-type').fadeOut();
    $('#div-accordion-cluster-type').removeClass("pf-m-expanded")
    $('#button-accordion-ssh-key').attr("aria-expanded", "false");
    $('#button-accordion-ssh-key').removeClass("pf-m-expanded");
    $('#div-accordion-ssh-key').fadeOut();
    $('#div-accordion-ssh-key').removeClass("pf-m-expanded")
    $('#button-accordion-hosts-file').attr("aria-expanded", "false");
    $('#button-accordion-hosts-file').removeClass("pf-m-expanded");
    $('#div-accordion-hosts-file').fadeOut();
    $('#div-accordion-hosts-file').removeClass("pf-m-expanded");
    $('#button-accordion-timeserver').attr("aria-expanded", "false");
    $('#button-accordion-timeserver').removeClass("pf-m-expanded");
    $('#div-accordion-timeserver').fadeOut();
    $('#div-accordion-timeserver').removeClass("pf-m-expanded");
    // nav, button등 이벤트에 적용된 속성 원복
    $('#nav-button-cluster-config-finish').addClass('pf-m-disabled');
    $('#nav-button-cluster-config-overview').removeClass('pf-m-disabled');
    $('#nav-button-cluster-config-cluster-type').removeClass('pf-m-disabled');
    $('#nav-button-cluster-config-ssh-key').removeClass('pf-m-disabled');
    $('#nav-button-cluster-config-ip-info').removeClass('pf-m-disabled');
    $('#nav-button-cluster-config-time-server').removeClass('pf-m-disabled');
    $('#nav-button-cluster-config-review').removeClass('pf-m-disabled');
    $('#button-before-step-modal-wizard-cluster-config-prepare').show();
    $('#button-before-step-modal-wizard-cluster-config-prepare').show();
    $('#button-cancel-config-modal-wizard-cluster-config-prepare').show();

    $('#div-modal-wizard-cluster-config-prepare').hide();
}


/**
 * Meathod Name : generateSshkey
 * Date Created : 2021.03.11
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 SSHKey를 생성하는 함수
 키 속성 - 패스워드(없음), 알고리즘(RSA2048), 덮어쓰기(TRUE)
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.03.11 최초 작성
 **/

function generateSshkey() {
    return new Promise(function (resolve) {
        resolve(cockpit.script(["ssh-keygen -t rsa -b 2048 -f /root/.ssh/temp_id_rsa -N '' <<<y 2>&1 >/dev/null"]));
    });
}


/**
 * Meathod Name : readSshKeyFile
 * Date Created : 2021.03.17
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 로컬에 존재하는 SSHKey를 읽어오는 함수
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.03.11 최초 작성
 **/

async function readSshKeyFile() {
    await generateSshkey();
    // 개인키 읽어오기
    cockpit.file("/root/.ssh/temp_id_rsa").read()
        .done(function (tag) {
            // console.log(tag);
            // ssh_key_textarea에 텍스트 삽입
            $('#div-textarea-cluster-config-temp-new-ssh-key-pri-file').val(tag);
        })
        .fail(function (error) {
        });
    // 공개키 읽어오기
    cockpit.file("/root/.ssh/temp_id_rsa.pub").read()
        .done(function (tag) {
            // console.log(tag);
            // ssh_key_textarea에 텍스트 삽입
            $('#div-textarea-cluster-config-temp-new-ssh-key-pub-file').val(tag);
        })
        .fail(function (error) {
        });
}


/**
 * Meathod Name : fileReaderFunc
 * Date Created : 2021.03.17
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 input box에서 파일을 선택하면 문자열로 읽어와 textarea에 담 함수
 * Parameter : input (input box id 값), textarea_type(textarea id 값), file_type(ssh-key, hosts 파일 타입에 따라 분류)
 * Return  : 없음
 * History  : 2021.03.11 최초 작성
 **/

function fileReaderFunc(input, textarea_type, file_type) {
    input.addEventListener('change', function (event) {
        let file_list = input.files || event.target.files;
        let file = file_list[0];
        let id = input.getAttribute('id');
        if ($(input).val() != "") {
            let file_name = file_list[0].name;
            // 파일 이름 및 용량 체크
            if (checkClusterConfigPrepareFileName(file_name, file_type) != false && checkFileSize(file) != false) {
                // FileList
                let reader = new FileReader();
                try {
                    reader.onload = function (progressEvent) {
                        // console.log(progressEvent.target.result);
                        let result = progressEvent.target.result;
                        $('#' + textarea_type).val(result);
                    };
                    reader.readAsText(file);
                } catch (err) {
                    console.error(err);
                }
            } else {
                // validation 실패 시 초기화
                $('#' + id).val("");
                $('#' + textarea_type).val("");
            }
        }
    });
}


/**
 * Meathod Name : fileExtensionChecker
 * Date Created : 2021.03.19
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 파일을 선택할 때 확장자를 체크하는 함수
 * Parameter : file_name
 * Return  : true, false
 * History  : 2021.03.19 최초 작성
 **/

function fileExtensionChecker(file_name) {
    let ext = file_name.split('.').pop().toLowerCase();
    if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xls', 'xlsx', 'hwp', 'html', 'js', 'rpm']) != -1) {
        alert('해당 확장자 파일은 업로드할 수 있습니다.');
        return false;
    }
    ;
}


/**
 * Meathod Name : checkClusterConfigPrepareFileName
 * Date Created : 2021.03.19
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 파일을 선택할 때 이름을 체크하는 함수
 * Parameter : fileName, file_type(ssh-key 또는 hosts)
 * Return  : true, false
 * History  : 2021.03.19 최초 작성
 **/

function checkClusterConfigPrepareFileName(file_name, file_type) {
    if (file_type == "pri-ssh_key") {
        if (file_name != "id_rsa") {
            alert("'id_rsa'으로 된 개인 키 파일만 업로드할 수 있습니다.");
            return false;
        }
    } else if (file_type == "pub-ssh_key") {
        if (file_name != "id_rsa.pub") {
            alert("'id_rsa.pub'으로 된 공개 키 파일만 업로드할 수 있습니다.");
            return false;
        }
    } else if (file_type == "cluster.json") {
        if (!file_name.match("cluster") && !file_name.match(".json")) {
            alert("'cluster.json'으로 된 파일만 업로드할 수 있습니다.");
            return false;
        }
    }
}


/**
 * Meathod Name : putSshKeyValueIntoTextarea
 * Date Created : 2021.03.22
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 설정에 따라 설정확인에 위치한 textarea에 ssh-key 값을 넣는 함수
 * Parameter : radio_value
 * Return  : 없음
 * History  : 2021.03.22 최초 작성
 **/

function putSshKeyValueIntoTextarea(radio_value) {
    if (radio_value == "new") {
        // SSH KEY 준비 방법 표시 및 값 설정
        $('#div-accordion-ssh-key-type').text("신규 생성");
        $('#div-textarea-cluster-config-confirm-ssh-key-pri-file').val($('#div-textarea-cluster-config-temp-new-ssh-key-pri-file').val());
        $('#div-textarea-cluster-config-confirm-ssh-key-pub-file').val($('#div-textarea-cluster-config-temp-new-ssh-key-pub-file').val());
    } else if (radio_value == "existing") {
        // SSH KEY 준비 방법 표시 및 값 설정
        $('#div-accordion-ssh-key-type').text("기존 파일 사용");
        $('#div-textarea-cluster-config-confirm-ssh-key-pri-file').val($('#div-textarea-cluster-config-temp-existing-ssh-key-pri-file').val());
        $('#div-textarea-cluster-config-confirm-ssh-key-pub-file').val($('#div-textarea-cluster-config-temp-existing-ssh-key-pub-file').val());
    }
}


/**
 * Meathod Name : putTimeServerValueIntoTextarea
 * Date Created : 2021.03.24
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 설정에 따라 설정확인에 위치한 구역에 time server 내용을 넣는 함수
 * Parameter : radio_value
 * Return  : 없음
 * History  : 2021.03.24 최초 작성
 **/

function putTimeServerValueIntoTextarea(radio_value) {
    if (radio_value == "external") {
        // time server 준비 방법 표시 및 값 설정
        $('#div-accordion-timeserver-type').text("외부 시간서버");
    } else if (radio_value == "internal") {
        // time server 준비 방법 표시 및 값 설정
        $('#div-accordion-timeserver-type').text("로컬 시간서버");
    }
    $('#div-cluster-config-confirm-time-server-1').text($('#form-input-cluster-config-time-server-ip-1').val());
    $('#div-cluster-config-confirm-time-server-2').text($('#form-input-cluster-config-time-server-ip-2').val());
    $('#div-cluster-config-confirm-extenal-time-server').text($('#form-input-cluster-config-external-time-server-ip').val());
}


/**
 * Meathod Name : saveAsFile
 * Date Created : 2021.03.21
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 변수 값을 다운로드 링크 형태로 제공하여 파일을 다운로드할 수 있는 함수
 * Parameter : id(링크 태크 id), str(다운로드 할 파일 내용), filename(다운로드 시 파일 명)
 * Return  : 없음
 * History  : 2021.03.21 최초 작성
 **/

function saveAsFile(id, str, filename) {
    $('#' + id).attr({
        target: '_blank',
        href: 'data:attachment/text,' + encodeURI(str),
        download: filename
    });
}


/**
 * Meathod Name : writeSshKeyFile
 * Date Created : 2021.03.17
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 완료를 누를 때 설정확인의 정보대로 파일(ssh-key)을 host에 업로드하거나 수정하는 함수
 * Parameter : text1, text2, file_type
 * Return  : 없음
 * History  : 2021.03.11 최초 작성
 **/

async function writeSshKeyFile(text1, text2) {
    cockpit.script(["touch /root/.ssh/id_rsa"])
    cockpit.file("/root/.ssh/id_rsa").replace(text1)
        .done(function (tag) {
        })
        .fail(function (error) {
        });
    // 개인 키 파일 권한 변경
    cockpit.script(["chmod 600 /root/.ssh/id_rsa"])
    cockpit.script(["touch /root/.ssh/id_rsa.pub"])
    cockpit.file("/root/.ssh/id_rsa.pub").replace(text2)
        .done(function (tag) {
        })
        .fail(function (error) {
        });
    // 공개 키 파일 권한 변경
    cockpit.script(["chmod 644 /root/.ssh/id_rsa.pub"])
    // 공개 키 authorized_key 파일에 공개 키 내용 append 및 중복 내용 제거
    cockpit.script(["cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys"])
    cockpit.script(["sort /root/.ssh/authorized_keys | uniq > /root/.ssh/authorized_keys.uniq"])
    cockpit.script(["mv -f /root/.ssh/authorized_keys{.uniq}"])
    cockpit.script(["chmod 644 /root/.ssh/authorized_keys"])
    cockpit.script(["rm -f /root/.ssh/authorized_keys.uniq"])

    // 임시 키 파일 삭제
    cockpit.script(["rm -f /root/.ssh/temp_id_rsa"])
    cockpit.script(["rm -f /root/.ssh/temp_id_rsa.pub"])
}

/**
 * Meathod Name : inputPnIntoTimeServer
 * Date Created : 2021.11.01
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 호스트 파일 메뉴에서 작성했던 PN IP 정보대로 로컬 시간서버에 자동 입력하는 함수
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.11.01 수정
 **/

function inputPnIntoTimeServer(os_type) {

    //let colcnt;
    let tbody_tr;
    radio_value = $('input[name=radio-hosts-file]:checked').val();
    if (radio_value == "new") {
        //colcnt = $('#form-table-cluster-config-new-host-profile colgroup col').length;
        tbody_tr = 'form-table-tbody-cluster-config-new-host-profile tr';
    }else if(radio_value == "existing") {
        //colcnt = $('#form-table-cluster-config-existing-host-profile colgroup col').length;
        tbody_tr = 'form-table-tbody-cluster-config-existing-host-profile tr';
    }

    let currentHostName = $('#form-input-current-host-name').val();

    if ($('#'+tbody_tr).length == 1){
        $('#form-radio-timeserver-host-num-2').prop('disabled', true);
        $('#form-radio-timeserver-host-num-3').prop('disabled', true);
    }else if ($('#'+tbody_tr).length == 2){
        $('#form-radio-timeserver-host-num-3').prop('disabled', true);
    }
    if (os_type == "ablestack-vm"){
        $('#'+ tbody_tr).each(function(index){
            idx_num = $(this).find('td').eq(0).text();
            hostName = $(this).find('td').eq(1).text();
            host_ip = $(this).find('td').eq(2).text();

            if(index < 2){
                $('#form-input-cluster-config-time-server-ip-'+(index+1)).val(host_ip);
            }

            if(currentHostName == hostName) {//호스트 네임을 가져와서 시간 서버의 종류를 선택한다. (Master Server, Second Server, Other Server)
                if(idx_num == 1){
                    $('#form-radio-timeserver-host-num-1').prop('checked', true);
                }else if(idx_num == 2){
                    // $('#form-input-cluster-config-int-to-ext').hide();
                    $('#form-radio-timeserver-host-num-2').prop('checked', true);
                }else{
                    // $('#form-input-cluster-config-int-to-ext').hide();
                    $('#form-radio-timeserver-host-num-3').prop('checked', true);
                }
            }
        });
    }else{
        $('#'+ tbody_tr).each(function(index){
            idx_num = $(this).find('td').eq(0).text();
            hostName = $(this).find('td').eq(1).text();
            pn_ip = $(this).find('td').eq(4).text();

            if(index < 2){
                $('#form-input-cluster-config-time-server-ip-'+(index+1)).val(pn_ip);
            }

            if(currentHostName == hostName) {//호스트 네임을 가져와서 시간 서버의 종류를 선택한다. (Master Server, Second Server, Other Server)
                if(idx_num == 1){
                    $('#form-radio-timeserver-host-num-1').prop('checked', true);
                }else if(idx_num == 2){
                    // $('#form-input-cluster-config-int-to-ext').hide();
                    $('#form-radio-timeserver-host-num-2').prop('checked', true);
                }else{
                    // $('#form-input-cluster-config-int-to-ext').hide();
                    $('#form-radio-timeserver-host-num-3').prop('checked', true);
                }
            }
        });
    }

}

async function modifyTimeServer(timeserver_confirm_ip_text, file_type, timeserver_current_host_num, external_time_server) {
    let chrony_file_root = "/etc/chrony.conf"
    let chrony_text = "";
    let tbody_tr;
    radio_value = $('input[name=radio-hosts-file]:checked').val();
    if (radio_value == "new") {
        //colcnt = $('#form-table-cluster-config-new-host-profile colgroup col').length;
        tbody_tr = 'form-table-tbody-cluster-config-new-host-profile tr';
    }else if(radio_value == "existing") {
        //colcnt = $('#form-table-cluster-config-existing-host-profile colgroup col').length;
        tbody_tr = 'form-table-tbody-cluster-config-existing-host-profile tr';
    }

    chrony_text +="# These servers were defined in the installation:"+"\n";
    chrony_text +="# Use public servers from the pool.ntp.org project."+"\n";
    chrony_text +="# Please consider joining the pool (http://www.pool.ntp.org/join.html)."+"\n";

    if (file_type == "external") {// 외부 시간 서버
        for (let i in timeserver_confirm_ip_text) {
            chrony_text +="server " + timeserver_confirm_ip_text[i] + " iburst"+"\n";
        }
    } else if (file_type == "internal") {// 로컬 시간 서버

            if (timeserver_current_host_num == 1) {
                if (external_time_server == "true"){
                    chrony_text +="server " + timeserver_confirm_ip_text.slice(-1) + " iburst"+"\n";
                }
                if ($('#'+tbody_tr).length != 2){
                    chrony_text +="server " + timeserver_confirm_ip_text[0] + " iburst minpoll 0 maxpoll 0"+"\n";
                }
                else{
                    chrony_text +="server " + timeserver_confirm_ip_text[1] + " iburst minpoll 0 maxpoll 0"+"\n";
                }

            } else if (timeserver_current_host_num == 2) {
                if (external_time_server == "true"){
                    chrony_text +="server " + timeserver_confirm_ip_text.slice(-1) + " iburst"+"\n";
                }
                chrony_text +="server " + timeserver_confirm_ip_text[0] + " iburst minpoll 0 maxpoll 0"+"\n";
            } else if (timeserver_current_host_num == 3) {
                if (external_time_server == "true"){
                    chrony_text +="server " + timeserver_confirm_ip_text.slice(-1) + " iburst"+"\n";
                }
                chrony_text +="server " + timeserver_confirm_ip_text[0] + " iburst minpoll 0 maxpoll 0"+"\n";
                chrony_text +="server " + timeserver_confirm_ip_text[1] + " prefer iburst minpoll 0 maxpoll 0"+"\n";
            } else {
                // 서버가 4대 이상일 경우 시간 서버 어떻게 해야할 지? 일단 외부시간 서버와 1번 2번 호스트를 바라보게 해놓음
                if (external_time_server == "true"){
                    chrony_text +="server " + timeserver_confirm_ip_text.slice(-1) + " iburst"+"\n";
                }
                chrony_text +="server " + timeserver_confirm_ip_text[0] + " iburst minpoll 0 maxpoll 0"+"\n";
                chrony_text +="server " + timeserver_confirm_ip_text[1] + " prefer iburst minpoll 0 maxpoll 0"+"\n";
            }

    }
    chrony_text +=""+"\n";

    chrony_text +="# Record the rate at which the system clock gains/losses time."+"\n";
    chrony_text +="driftfile /var/lib/chrony/drift"+"\n";
    chrony_text +=""+"\n";
    chrony_text +="# Allow the system clock to be stepped in the first three updates"+"\n";
    chrony_text +="# if its offset is larger than 1 second."+"\n";
    chrony_text +="makestep 1.0 3"+"\n";
    chrony_text +=""+"\n";
    chrony_text +="# Enable kernel synchronization of the real-time clock (RTC)."+"\n";
    chrony_text +="rtcsync"+"\n";
    chrony_text +=""+"\n";
    chrony_text +="# Enable hardware timestamping on all interfaces that support it."+"\n";
    chrony_text +="#hwtimestamp *"+"\n";
    chrony_text +=""+"\n";
    chrony_text +="# Increase the minimum number of selectable sources required to adjust"+"\n";
    chrony_text +="# the system clock."+"\n";
    chrony_text +="#minsources 2"+"\n";
    chrony_text +=""+"\n";
    chrony_text +="# Allow NTP client access from local network."+"\n";
    chrony_text +="allow 0.0.0.0/0"+"\n";
    chrony_text +=""+"\n";
    chrony_text +="# Serve time even if not synchronized to a time source."+"\n";

    if (file_type == "external") {
        chrony_text +="#local stratum 10"+"\n";
    } else if (file_type == "internal") {
        chrony_text +="local stratum 10"+"\n";
    }
    chrony_text +=""+"\n";

    chrony_text +="# Specify file containing keys for NTP authentication."+"\n";
    chrony_text +="keyfile /etc/chrony.keys"+"\n";
    chrony_text +=""+"\n";
    chrony_text +="# Get TAI-UTC offset and leap seconds from the system tz database."+"\n";
    chrony_text +="leapsectz right/UTC"+"\n";
    chrony_text +=""+"\n";
    chrony_text +="# Specify directory for log files."+"\n";
    chrony_text +="logdir /var/log/chrony"+"\n";
    chrony_text +=""+"\n";
    chrony_text +="# Select which information is logged."+"\n";
    chrony_text +="#log measurements statistics tracking"+"\n";

    //파일쓰기 재시작
    cockpit.file(chrony_file_root).replace(chrony_text)
    .done(function (data) { //성공
        //재시작
        cockpit.script(["systemctl restart chronyd"])
    })
    .fail(function (error) { //실패

    });
}



/**
 * Meathod Name : validateClusterConfigPrepare
 * Date Created : 2021.03.25
 * Writer  : 류홍욱
 * Description : 클러스터 준비 마법사에서 완료를 누를 때 유효성 검사하는 함수
 * Parameter : timeserver_type(시간서버 타입에 따라 필수 입력 값이 달라져 구분하기 위한 값)
 * Return  : 없음
 * History  : 2021.04.12 수정
 */
function validateClusterConfigPrepare(timeserver_type, os_type) {
    let validate_check = true;
    // time server가 외부일 때는 IP, 문자열 입력 가능하나 내부일 때는 IP형식으로만 입력 가능
    let timeserver_ip_check_external_1 = checkHostFormat($('#div-cluster-config-confirm-time-server-1').text());
    let timeserver_ip_check_external_2 = checkHostFormat($('#div-cluster-config-confirm-time-server-2').text());
    let timeserver_ip_check_internal_1 = checkHostFormat($('#div-cluster-config-confirm-time-server-1').text());
    let timeserver_ip_check_internal_2 = checkHostFormat($('#div-cluster-config-confirm-time-server-2').text());

    let host_file_type = $('input[name=radio-hosts-file]:checked').val();

    let ccvm_mngt_ip = $('#form-input-cluster-ccvm-mngt-ip').val().trim();
    let mngt_nic_cidr =  $("#form-input-cluster-mngt-nic-cidr").val();
    let mngt_nic_gateway = $("#form-input-cluster-mngt-nic-gateway").val();
    let mngt_nic_dns = $("#form-input-cluster-mngt-nic-dns").val();
    let pcs_host1 = $('#form-input-cluster-pcs-hostname1').val().trim();
    let pcs_host2 = $('#form-input-cluster-pcs-hostname2').val().trim();
    let pcs_host3 = $('#form-input-cluster-pcs-hostname3').val().trim();


    if ($('#div-textarea-cluster-config-confirm-ssh-key-pri-file').val().trim() == "") {
        alert("SSH 개인 키 파일 정보를 확인해 주세요.");
        validate_check = false;
    } else if ($('#div-textarea-cluster-config-confirm-ssh-key-pub-file').val().trim() == "") {
        alert("SSH 공개 키 파일 정보를 확인해 주세요.");
        validate_check = false;
    } else if ($('#div-textarea-cluster-config-confirm-hosts-file').val().trim() == "") {
        alert("클러스터 구성 프로파일 정보를 확인해 주세요.");
        validate_check = false;
    } else if (validateClusterConfigProfile(host_file_type, option, os_type)) { // config 유효성 검사
        validate_check = false;
    } else if (os_type == ""){
        alert("OS Type을 선택해주세요.")
        validate_check = false;
    }else if (ccvm_mngt_ip == "") {
        alert("CCVM 관리 IP정보를 입력해주세요.");
        validate_check = false;
    } else if(!checkIp(ccvm_mngt_ip)){
        alert("CCVM 관리 IP 형식을 확인해주세요.");
        validate_check = false;
    } else if(mngt_nic_cidr != "" && !$.isNumeric(mngt_nic_cidr)){
        alert("관리 NIC CIDR는 숫자만 입력 가능합니다.");
        validate_check = false;
    } else if(mngt_nic_cidr != "" && !(mngt_nic_cidr >= 0 && mngt_nic_cidr <= 32) ){
        alert("관리 NIC CIDR 범위는 0~32 입니다.");
        validate_check = false;
    } else if(mngt_nic_gateway != "" && !checkIp(mngt_nic_gateway)){
        alert("관리 NIC Gateway 형식을 확인해주세요.");
        validate_check = false;
    } else if(mngt_nic_dns != "" && !checkIp(mngt_nic_dns)){
        alert("관리 NIC DNS 형식을 확인해주세요.");
        validate_check = false;
    } else if(os_type != "ablestack-vm"){
        if (pcs_host1 == "") {
            alert("PCS 호스트1 PN IP를 입력해주세요.");
            validate_check = false;
        } else if(!checkIp(pcs_host1)){
            alert("PCS 호스트1 PN IP 형식을 확인해주세요.");
            validate_check = false;
        } else if (pcs_host2 == "") {
            alert("PCS 호스트2 PN IP를 입력해주세요.");
            validate_check = false;
        } else if(!checkIp(pcs_host2)){
            alert("PCS 호스트2 PN IP 형식을 확인해주세요.");
            validate_check = false;
        } else if (pcs_host3 == "") {
            alert("PCS 호스트3 PN IP를 입력해주세요.");
            validate_check = false;
        } else if(!checkIp(pcs_host3)){
            alert("PCS 호스트3 PN IP 형식을 확인해주세요.");
            validate_check = false;
        } else if(pcs_host1 == pcs_host2 || pcs_host1 == pcs_host3 || pcs_host2 == pcs_host3){
            alert("중복된 PCS 호스트 PN IP가 존재합니다.");
            validate_check = false;
        } else if (pcsHostPnIpCheck(host_file_type, pcs_host1, option)) { //host1 name
            validate_check = false;
        } else if (pcsHostPnIpCheck(host_file_type, pcs_host2, option)) { //host2 name
            validate_check = false;
        } else if (pcsHostPnIpCheck(host_file_type, pcs_host3, option)) { //host3 name
            validate_check = false;
        }
    } else if(os_type == "ablestack-vm"){
        if (host_file_type == "add"){
            if ($('#form-input-cluster-config-credentials-ipmi-ip').val() == ""){
                alert("IPMI IP를 입력해주세요.");
                validate_check = false;
            }else if ($('#form-input-cluster-config-credentials-ipmi-user').val() == ""){
                alert("IPMI User를 입력해주세요.");
                validate_check = false;
            }else if ($('#form-input-cluster-config-credentials-ipmi-password').val() == "" ){
                alert("IPMI Password를 입력해주세요.");
                validate_check = false;
            }else if (!checkIp($('#form-input-cluster-config-credentials-ipmi-ip').val())){
                alert("IPMI IP 형식을 확인해주세요.");
                validate_check = false;
            }
        }
    }else if (checkDuplicateCcvmIp(ccvm_mngt_ip, host_file_type, option, os_type)) { // config 유효성 검사
        validate_check = false;
    } else if (timeserver_type == "external") {
        if (timeserver_ip_check_external_1 == false) {
            alert("시간 서버 1번 IP정보를 확인해 주세요.");
            validate_check = false;
        } else if (timeserver_ip_check_external_2 == false && $('#div-cluster-config-confirm-time-server-2').text() != "") {
            alert("시간 서버 2번 IP정보를 확인해 주세요.");
            validate_check = false;
        }
    } else if (timeserver_type == "internal") {
        if (timeserver_ip_check_internal_1 == false) {
            alert("시간 서버 1번 정보를 확인해 주세요.");
            validate_check = false;
        } else if (timeserver_ip_check_internal_2 == false) {
            alert("시간 서버 2번 정보를 확인해 주세요.");
            validate_check = false;
        }
    }
    return validate_check;
}

/**
 * Meathod Name : showDivisionClusterConfigFinish
 * Date Created : 2022.09.13
 * Writer  : 배태주
 * Description : 클러스터 구성 마무리 작업 및 완료 페이지를 보여주는 함수
 * Parameter : 없음
 * Return  : 없음
 * History  : 2022.09.13 최초 작성
 */
 function showDivisionClusterConfigFinish() {
    // time server 파일
    timeserver_type = $('input[name=radio-timeserver]:checked').val();
    let timeserver_current_host_num = $('input[name=radio-timeserver_host_num]:checked').val();
    let timeserver_confirm_ip_list = new Array();
    for (let i = 1; i <= 2; i++) {
        timeserver_confirm_ip_list.push($('#form-input-cluster-config-time-server-ip-' + i).val());
    }
    if ($('#form-input-cluster-config-external-time-server-ip').val() != ""){
        timeserver_confirm_ip_list.push($('#form-input-cluster-config-external-time-server-ip').val());
        timeserver_confirm_ip_list = timeserver_confirm_ip_list.filter(function (item) {
            return item !== null && item !== undefined && item !== '';
        });
        modifyTimeServer(timeserver_confirm_ip_list, timeserver_type, timeserver_current_host_num, "true");
    }else{
        timeserver_confirm_ip_list = timeserver_confirm_ip_list.filter(function (item) {
            return item !== null && item !== undefined && item !== '';
        });
        modifyTimeServer(timeserver_confirm_ip_list, timeserver_type, timeserver_current_host_num);
    }

    $('#button-next-step-modal-wizard-cluster-config-prepare').show();
    $('#button-next-step-modal-wizard-cluster-config-prepare').html('종료');

    $('#div-modal-wizard-cluster-config-deploy').hide();
    $('#div-modal-wizard-cluster-config-finish').show();
    $('#nav-button-cluster-config-finish').removeClass('pf-m-disabled');
    $('#nav-button-cluster-config-finish').addClass('pf-m-current');
    cur_step_wizard_cluster_config_prepare = "7";
}

/**
 * Meathod Name : screenConversion
 * Date Created : 2024.11.11
 * Writer  : 정민철
 * Description : 클러스터 종류별 스크린 변화
 * Parameter : 없음
 * Return  : 없음
 * History  : 2024.11.11 최초 작성
 */
function screenConversion(){
    if ($('#selected-cluster-type').val() == "ablestack-vm"){
        $('#form-input-cluster-config-host-number').val(1);
        $('#div-form-hosts-ablestack-vm').show();
        $('#div-form-hosts').hide();
        $('[name="pcs-cluster"]').hide();
        $('[name="pcs-host-pn-ip-all"]').hide();
        if($('[name="radio-cluster-host"').val() == "add"){
            $('[name="cluster-config-ccvm-info"]').hide();
            $('[name="cluster-config-ipmi-info"]').show();
            $('#span-cluster-progress-step1-text').text("SSH Key File 생성");
            $('#span-cluster-progress-step2-text').text("Cluster Config 및 Hosts 파일 생성 및 PCS 호스트 추가 설정");
        }else{
            $('[name="cluster-config-ccvm-info"]').show();
            $('[name="cluster-config-ipmi-info"]').hide();
        }
    }else{
        $('[name="cluster-config-ipmi-info"]').hide();
        $('#form-input-cluster-config-host-number').val(3);
        $('#div-form-hosts-ablestack-vm').hide();
        $('#div-form-hosts').show();
        $('[name="pcs-cluster"]').show();
    }
}

/**
 * Meathod Name : saveTableData
 * Date Created : 2024.11.11
 * Writer  : 정민철
 * Description : 테이블의 각 행 데이터를 저장하는 함수
 * Parameter : 없음
 * Return  : 없음
 * History  : 2024.11.11 최초 작성
 */
function saveTableData(host_file_type) {
    // 선택자 설정
    const selector = host_file_type === "new"
        ? '#form-table-tbody-cluster-config-new-host-profile tr'
        : '#form-table-tbody-cluster-config-existing-host-profile tr';

        const targetRow = $(selector);

        targetRow.each(function() {
            HostProfileData.push($(this).find('td').eq(2).text().trim());
        });
}
