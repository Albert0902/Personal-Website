/* 通用弹窗开关 */
function openPopup(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('show');
}

function closePopup(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
}

/* 点击弹窗任意位置关闭 */
document.querySelectorAll('.honor-popup, .qr_popup').forEach(function (popup) {
    popup.addEventListener('click', function () {
        closePopup(popup.id);
    });
});
