$(function() {
    const form = layui.form;
    const layer = layui.layer;
    // 自定义昵称校验规则
    form.verify({
        nickname: (val) => {
            if(val.length > 8) return "昵称长度必须在 1 ~ 8 个字符之间！"
        }
    });

    // 初始化用户信息
    const initUserInfo = () => {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: (res) => {
                console.log(res);
                if(res.status !== 0) return layer.msg('获取用户信息失败');
                layer.msg('获取用户信息成功');

                // 为表单快速赋值
                form.val('formUserInfo',res.data)
            },
        });
    };
    // 调用初始化用户信息函数
    initUserInfo();

    // 实现点击重置
    $('#btnReset').click((e) => {
        // 阻止默认行为
        e.preventDefault();
        initUserInfo();
    });

    // 更新用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        console.log($(this).serialize());
        $.ajax({
            type: 'POST',
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: (res) => {
                if(res.status !== 0) return layer.msg('更新用户信息失败');
                layer.msg('更新用户信息成功');
                // 调用index.js getUserInifo 方法重新渲染头像旁的用户名
                window.parent.getUserInfo();
            }
        })
    })
});