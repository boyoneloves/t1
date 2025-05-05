// Nội dung file: modal-handler.js (Dropdown Sản Phẩm Lọc theo Trang)

// === URL Google Apps Script Web App ===
const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwA9wrrqbahgxEoeAiFB2UUVzEwDnUVn-q-4biiC79P4CtZwWu1s9eQGjzCC5oli8sm/exec'; // Thay thế nếu cần

// === DỮ LIỆU SẢN PHẨM / COMBO ===
const productOptions = [
    // --- Combo Khuynh Diệp ---
    { value: "1 Hộp KD30", text: "1 Hộp Nhang Khuynh Diệp" },
    { value: "2 Hộp KD30", text: "2 Hộp Nhang Khuynh Diệp (Tiết Kiệm)" },
    { value: "5 Hộp KD30", text: "5 Hộp Nhang Khuynh Diệp (Gia Đình)" },
	    // --- Combo QUẾ ---
    { value: "1Q30", text: "1 Hộp Nhang Quế Vỏ" },
    { value: "2Q30", text: "2 Hộp Nhang Quế Vỏ (Tiết Kiệm)" },
    { value: "5Q30", text: "5 Hộp Nhang Quế Vỏ (Gia Đình)" },
	    // --- Combo NỤ QUẾ ---
    { value: "100NUQ", text: "100Gram Nụ Quế Vỏ (Dùng Thử)" },
    { value: "330NUQ", text: "330Gram Nụ Quế Vỏ (Tiết Kiệm)" },
    { value: "500NUQ", text: "500Gram Nụ Quế Vỏ (Gia Đình)" },
    // --- Sản Phẩm Lẻ ---

    // --- Option Tư Vấn ---
    { value: "Tu Van Them", text: "Cần tư vấn thêm" },
];

// === HTML của Modal ===
const modalHTMLString = `
<div id="contactModal" class="modal-overlay" aria-hidden="true">
    <div class="modal-content" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDesc">
        <button id="closeContactPopupBtn" class="modal-close-btn" aria-label="Đóng cửa sổ">&times;</button>
        <h2 id="modalTitle">Thông Tin Đặt Hàng</h2>
        <p id="modalDesc">Vui lòng điền đầy đủ thông tin dưới đây.</p>
        <form id="contactForm">
             <div class="form-group">
                 <label for="customerName">Họ và Tên:</label>
                 <input type="text" id="customerName" name="customerName" required autocomplete="name">
             </div>
             <div class="form-group">
                 <label for="customerPhone">Số Điện Thoại:</label>
                 <input type="tel" id="customerPhone" name="customerPhone" required pattern="[0-9]{10,11}" title="Số điện thoại gồm 10-11 chữ số" autocomplete="tel">
             </div>
             <div class="form-group">
                 <label>Địa chỉ giao hàng:</label>
                 <div class="address-select-group">
                     <select id="province" name="province" required >
                         <option value="" disabled selected>-- Chọn Tỉnh/Thành Phố --</option>
                     </select>
                     <select id="district" name="district" required disabled>
                         <option value="" disabled selected>-- Chọn Quận/Huyện --</option>
                     </select>
                     <select id="ward" name="ward" required disabled>
                         <option value="" disabled selected>-- Chọn Phường/Xã --</option>
                     </select>
                 </div>
             </div>
             <div class="form-group">
                 <label for="customerAddress">Địa Chỉ Cụ Thể (Số nhà, tên đường):</label>
                 <textarea id="customerAddress" name="customerAddress" rows="2" required placeholder="Ví dụ: Số 123, Đường ABC" autocomplete="street-address"></textarea>
             </div>
             <div class="form-group">
                 <label for="productCombo">Chọn Gói Sản Phẩm:</label>
                 <select id="productCombo" name="productCombo" required>
                     <option value="" disabled selected>-- Chọn gói --</option>
                     {/* JS sẽ đổ dữ liệu vào đây */}
                 </select>
             </div>
             <div class="form-group form-submit-area">
                  <button type="submit" class="cta-button" id="submitContactFormBtn">Gửi Thông Tin Đặt Hàng</button>
                  <p id="formStatus" class="form-status-message" aria-live="polite"></p>
             </div>
        </form>
    </div>
</div>
`;

// === Biến lưu trữ dữ liệu địa chỉ ===
let allProvincesData = null;
let allDistrictsData = null;
let allWardsData = null;
let isAddressDataLoadingOrLoaded = false;

// ---------------------------------------------------------------------------
// SECTION: Core Modal Logic
// (Các hàm openModal, closeModal, handleFormSubmit, handleComboSelect giữ nguyên)
// ---------------------------------------------------------------------------
function openModal(event) { /* ... */ }
function closeModal() { /* ... */ }
async function handleFormSubmit(event) { /* ... */ }
function handleComboSelect(event) { /* ... */ }

// ---------------------------------------------------------------------------
// SECTION: Address Handling Logic
// (Các hàm loadAllAddressData, populateAddressSelect, handleProvinceChange, handleDistrictChange, initializeAddressDropdowns giữ nguyên)
// ---------------------------------------------------------------------------
async function loadAllAddressData() { /* ... */ }
function populateAddressSelect(selectElement, data, filterKey, filterValue, defaultOptionText) { /* ... */ }
function handleProvinceChange() { /* ... */ }
function handleDistrictChange() { /* ... */ }
async function initializeAddressDropdowns() { /* ... */ }

// ---------------------------------------------------------------------------
// SECTION: Product Dropdown Logic (ĐÃ CẬP NHẬT)
// ---------------------------------------------------------------------------

// Hàm đổ dữ liệu Sản phẩm/Combo vào Select (CÓ THÊM LỌC)
function populateProductSelect(filterKeyword = null) { // Thêm tham số filterKeyword
    const comboSelectElement = document.getElementById('productCombo');
    if (!comboSelectElement) {
        console.error("Không tìm thấy Select#productCombo.");
        return;
    }

    // Xóa các option cũ (trừ option default "-- Chọn gói --")
    comboSelectElement.querySelectorAll('option:not([disabled])').forEach(opt => opt.remove());

    // Lọc và thêm các option
    productOptions.forEach(item => {
        let shouldAdd = false;

        if (!filterKeyword) {
            // Nếu không có filter (trang chủ), thêm tất cả
            shouldAdd = true;
        } else {
            // Nếu có filter (trang sản phẩm):
            // 1. Kiểm tra xem text hoặc value có chứa keyword không (không phân biệt hoa thường)
            const keywordLower = filterKeyword.toLowerCase();
            const textLower = item.text.toLowerCase();
            const valueLower = item.value.toLowerCase();
            if (textLower.includes(keywordLower) || valueLower.includes(keywordLower)) {
                shouldAdd = true;
            }
            // 2. Luôn thêm option "Cần tư vấn thêm"
            if (item.value === "Tu Van Them") {
                shouldAdd = true;
            }
        }

        // Nếu nên thêm, tạo và thêm option
        if (shouldAdd) {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.text;
            comboSelectElement.appendChild(option);
        }
    });

    // Reset về lựa chọn mặc định sau khi đổ dữ liệu
    comboSelectElement.value = "";

    console.log(`Đã đổ dữ liệu sản phẩm vào dropdown ${filterKeyword ? `(lọc theo: "${filterKeyword}")` : '(hiển thị tất cả)'}.`);
}


// ---------------------------------------------------------------------------
// SECTION: Main Initialization and Event Binding
// ---------------------------------------------------------------------------

// Hàm gắn các sự kiện CHUNG
function attachModalEventListeners() {
    // (Giữ nguyên phần lấy element và gắn sự kiện cho các nút mở/đóng/submit/combo)
    /* ... */
}

// Hàm khởi tạo chính (ĐÃ CẬP NHẬT)
async function initializeContactModal() {
    // Lấy từ khóa lọc từ data attribute của thẻ body
    const filterKeyword = document.body.dataset.productPage || null; // Lấy giá trị từ data-product-page, nếu không có thì là null
    console.log("Trang hiện tại có filterKeyword:", filterKeyword);

    if (document.getElementById('contactModal')) {
        console.log("Modal đã tồn tại. Populate lại product select với filter (nếu có).");
        populateProductSelect(filterKeyword); // Populate lại product select khi modal đã có
        await initializeAddressDropdowns();
        return;
    }
    try {
        document.body.insertAdjacentHTML('beforeend', modalHTMLString);
        console.log("Đã chèn HTML modal.");

        // Đổ dữ liệu sản phẩm (đã lọc nếu cần) vào dropdown
        populateProductSelect(filterKeyword);

        // Gắn các sự kiện chung
        attachModalEventListeners();

        // Khởi tạo và gắn sự kiện cho phần địa chỉ
        await initializeAddressDropdowns();

    } catch (error) {
        console.error("Lỗi khi khởi tạo contact modal:", error);
    }
}

// === Chạy hàm khởi tạo khi DOM đã sẵn sàng ===
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContactModal);
} else {
    initializeContactModal();
}

// --- Đảm bảo bạn đã copy đầy đủ các hàm còn thiếu vào đây ---
// (openModal, closeModal, handleFormSubmit, handleComboSelect, loadAllAddressData,
// populateAddressSelect, handleProvinceChange, handleDistrictChange,
// initializeAddressDropdowns, attachModalEventListeners)
// Ví dụ:
function openModal(event) { if (event) event.preventDefault(); const modalOverlay = document.getElementById('contactModal'); if (!modalOverlay) return; modalOverlay.setAttribute('aria-hidden', 'false'); modalOverlay.classList.add('modal-active'); const contactForm = document.getElementById('contactForm'); requestAnimationFrame(() => { contactForm?.querySelector('input:not([type=hidden]), select, textarea')?.focus(); }); console.log("Modal opened"); }
function closeModal() { const modalOverlay = document.getElementById('contactModal'); const contactForm = document.getElementById('contactForm'); const formStatus = document.getElementById('formStatus'); const submitBtn = document.getElementById('submitContactFormBtn'); const provinceSelect = document.getElementById('province'); const districtSelect = document.getElementById('district'); const wardSelect = document.getElementById('ward'); if (!modalOverlay) return; modalOverlay.setAttribute('aria-hidden', 'true'); modalOverlay.classList.remove('modal-active'); if(formStatus) formStatus.textContent = ''; if(formStatus) formStatus.className = 'form-status-message'; if(contactForm) contactForm.reset(); if(districtSelect) { populateAddressSelect(districtSelect, {}, null, null, '-- Chọn Quận/Huyện --'); districtSelect.disabled = true; } if(wardSelect) { populateAddressSelect(wardSelect, {}, null, null, '-- Chọn Phường/Xã --'); wardSelect.disabled = true; } if(provinceSelect) provinceSelect.value = ""; if(submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Gửi Thông Tin Đặt Hàng'; } console.log("Modal closed and form reset."); }
async function handleFormSubmit(event) { event.preventDefault(); const contactForm = document.getElementById('contactForm'); const formStatus = document.getElementById('formStatus'); const submitBtn = document.getElementById('submitContactFormBtn'); if (!contactForm || !submitBtn || !formStatus) return; submitBtn.disabled = true; submitBtn.textContent = 'Đang gửi...'; formStatus.textContent = ''; formStatus.className = 'form-status-message'; const formData = new FormData(contactForm); const data = {}; formData.forEach((value, key) => { data[key] = value; }); data['timestamp'] = new Date().toLocaleString('vi-VN'); console.log("Dữ liệu gửi đi:", data); try { const response = await fetch(googleScriptURL, { method: 'POST', mode: 'no-cors', cache: 'no-cache', redirect: 'follow', body: JSON.stringify(data) }); formStatus.textContent = '✓ CẢM ƠN BẠN ĐÃ ĐẶT HÀNG!'; formStatus.classList.add('success'); setTimeout(closeModal, 3000); } catch (error) { console.error('Lỗi gửi form:', error); formStatus.textContent = '❌ Có lỗi xảy ra, vui lòng thử lại hoặc gọi 0905792892'; formStatus.classList.add('error'); submitBtn.disabled = false; submitBtn.textContent = 'Gửi Thông Tin Đặt Hàng'; } }
function handleComboSelect(event) { const button = event.target.closest('.combo-select-btn'); if (!button) return; const comboValue = button.dataset.combo; const comboSelectElement = document.getElementById('productCombo'); if (comboSelectElement && comboValue) { const targetOption = [...comboSelectElement.options].find(option => option.value === comboValue); if (targetOption) { comboSelectElement.value = comboValue; console.log("Đã chọn combo:", comboValue); } else { console.warn("Giá trị combo '" + comboValue + "' không tồn tại trong Select#productCombo. Kiểm tra data-combo và value của option."); comboSelectElement.value = ""; } } else { console.warn("Không tìm thấy Select#productCombo hoặc nút thiếu data-combo"); } openModal(); }
async function loadAllAddressData() { if (isAddressDataLoadingOrLoaded) return; isAddressDataLoadingOrLoaded = true; console.log("Bắt đầu tải dữ liệu địa chỉ..."); try { const [provinceRes, districtRes, wardRes] = await Promise.all([ fetch('https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tinh_tp.json'), fetch('https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/quan_huyen.json'), fetch('https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/xa_phuong.json') ]); if (!provinceRes.ok || !districtRes.ok || !wardRes.ok) { throw new Error("Lỗi HTTP khi tải dữ liệu địa chỉ."); } allProvincesData = await provinceRes.json(); allDistrictsData = await districtRes.json(); allWardsData = await wardRes.json(); console.log("Dữ liệu địa chỉ đã tải xong."); } catch (error) { console.error("Lỗi nghiêm trọng khi tải dữ liệu địa chỉ:", error); isAddressDataLoadingOrLoaded = false; throw error; } }
function populateAddressSelect(selectElement, data, filterKey, filterValue, defaultOptionText) { if (!selectElement || !data) { console.warn("populateAddressSelect: Invalid selectElement or data."); return; } selectElement.innerHTML = ''; const defaultOption = document.createElement('option'); defaultOption.value = ""; defaultOption.textContent = defaultOptionText; defaultOption.disabled = true; defaultOption.selected = true; selectElement.appendChild(defaultOption); const sortedData = Object.entries(data).sort(([, a], [, b]) => (a.name_with_type || a.name || '').localeCompare(b.name_with_type || b.name || '', 'vi') ); for (const [code, item] of sortedData) { if (!filterKey || item[filterKey] === filterValue) { const option = document.createElement('option'); option.value = item.name; option.dataset.code = code; option.textContent = item.name_with_type || item.name; selectElement.appendChild(option); } } }
function handleProvinceChange() { const provinceSelect = document.getElementById('province'); const districtSelect = document.getElementById('district'); const wardSelect = document.getElementById('ward'); if (!provinceSelect || !districtSelect || !wardSelect) return; const selectedOption = provinceSelect.options[provinceSelect.selectedIndex]; const provinceCode = selectedOption.dataset.code; populateAddressSelect(districtSelect, {}, null, null, '-- Chọn Quận/Huyện --'); populateAddressSelect(wardSelect, {}, null, null, '-- Chọn Phường/Xã --'); districtSelect.disabled = true; wardSelect.disabled = true; if (provinceCode && allDistrictsData) { populateAddressSelect(districtSelect, allDistrictsData, 'parent_code', provinceCode, '-- Chọn Quận/Huyện --'); districtSelect.disabled = false; } }
function handleDistrictChange() { const districtSelect = document.getElementById('district'); const wardSelect = document.getElementById('ward'); if (!districtSelect || !wardSelect) return; const selectedOption = districtSelect.options[districtSelect.selectedIndex]; const districtCode = selectedOption.dataset.code; populateAddressSelect(wardSelect, {}, null, null, '-- Chọn Phường/Xã --'); wardSelect.disabled = true; if (districtCode && allWardsData) { populateAddressSelect(wardSelect, allWardsData, 'parent_code', districtCode, '-- Chọn Phường/Xã --'); wardSelect.disabled = false; } }
async function initializeAddressDropdowns() { const provinceSelect = document.getElementById('province'); const districtSelect = document.getElementById('district'); const wardSelect = document.getElementById('ward'); if (!provinceSelect || !districtSelect || !wardSelect) { console.error("initializeAddressDropdowns: Không tìm thấy các thẻ select địa chỉ."); return; } if (!isAddressDataLoadingOrLoaded) { try { await loadAllAddressData(); } catch (error) { provinceSelect.disabled = true; return; } } if (allProvincesData) { populateAddressSelect(provinceSelect, allProvincesData, null, null, '-- Chọn Tỉnh/Thành Phố --'); } else { console.error("Dữ liệu Tỉnh/Thành phố chưa sẵn sàng."); provinceSelect.disabled = true; return; } if (!provinceSelect.dataset.listenerAttached) { provinceSelect.addEventListener('change', handleProvinceChange); districtSelect.addEventListener('change', handleDistrictChange); provinceSelect.dataset.listenerAttached = 'true'; console.log("Đã gắn listener cho select địa chỉ."); } }
function attachModalEventListeners() { const openModalBtn = document.getElementById('openContactPopupBtn'); const openModalBtnAlt = document.getElementById('openContactPopupBtnAlt'); const openModalBtnMain = document.getElementById('openContactPopupBtnMain'); const navOpenModalLink = document.getElementById('navOpenContactPopup'); const mobileOpenModalLink = document.getElementById('mobileOpenContactPopup'); const closeModalBtn = document.getElementById('closeContactPopupBtn'); const modalOverlay = document.getElementById('contactModal'); const contactForm = document.getElementById('contactForm'); const comboContainer = document.querySelector('.combo-container'); const comboContainerDetail = document.querySelector('#combo-detail .combo-container'); const productGridNew = document.querySelector('.product-grid-new'); const openTriggers = [openModalBtn, openModalBtnAlt, openModalBtnMain, navOpenModalLink, mobileOpenModalLink]; openTriggers.forEach(trigger => { if (trigger) trigger.addEventListener('click', openModal); }); if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal); if (modalOverlay) modalOverlay.addEventListener('click', (event) => { if (event.target === modalOverlay) closeModal(); }); if (contactForm) contactForm.addEventListener('submit', handleFormSubmit); document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modalOverlay?.classList.contains('modal-active')) closeModal(); }); if (comboContainer) comboContainer.addEventListener('click', handleComboSelect); if (comboContainerDetail) comboContainerDetail.addEventListener('click', handleComboSelect); if (productGridNew) productGridNew.addEventListener('click', handleComboSelect); console.log("Đã gắn xong các event listener chung."); }
