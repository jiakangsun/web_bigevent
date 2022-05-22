$(function() {
    const layer = layui.layer;
    const form = layui.form;

    const initArtCateList = () => {
        $.ajax({
            type: 'GET',
            url: "/my/article/cates",
            success: (res) => {
                if(res.status !== 0) return layer.msg('获取文章分类失败');
                layer.msg('获取文章分类成功');
                const htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr);
            },
        });
    };

    initArtCateList();

    // 添加类别弹窗
    let indexAdd = null;
    $('#btnAddCate').click(() => {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $('#dialog-add').html(),
        });
    });

    // 添加分类
    $('body').on('submit','#form-add',function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: (res) => {
                if(res.status !== 0) return layer.msg('添加分类失败');
                layer.msg('添加分类成功');
                // 添加完  重现渲染数据
                initArtCateList();
                // 关闭弹窗
                layer.close(indexAdd);
            }
        });
    });

    // 修改类别弹窗
    let indexEdit = null;
    $('tbody').on('click','.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $('#dialog-edit').html(),
        });

        // console.log($(this).attr('data-id'));
        // 发起请求获取对应分类的数据
        const id = $(this).attr('data-id'); // 点击对应编辑按钮 的id
        $.ajax({
            type: 'GET',
            url: "/my/article/cates/" + id,
            success: (res) => {
                if(res.status !== 0) return layer.msg('获取文章分类失败');
                layer.msg('获取文章分类成功');
                form.val('form-edit',res.data);
                // console.log(res);
            },
        });
    }); 

    // 更新文章分类
    $('body').on('submit','#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url:  '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                if(res.status !== 0) return layer.msg('更新文章内容失败');
                layer.msg('更新文章内容成功');
                // 提交完关闭弹窗
                layer.close(indexEdit);
                // 刷新页面  重新获取数据 
                initArtCateList();
            },
        });
    });

    // 删除文章分类
    $('tbody').on('click','.btn-delete', function() {
       const id = $(this).attr('data-id');
       // 提示用户是否删除
       layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
           $.ajax({
               type: 'GET',
               url: "/my/article/deletecate/" + id,
               success: (res) => {
                   if(res.status !== 0) return layer.msg('删除文章分类失败！');
                   layer.msg('删除文章分类成功！');
                   layer.close(index);
                   // 刷新页面  重新获取数据 
                   initArtCateList();
               }
           })
       });
    });
});