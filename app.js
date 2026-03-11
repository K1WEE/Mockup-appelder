(function () {
    'use strict';

    // ── DOM REFS ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const splash = $('#splash-screen');
    const app = $('#app');

    // Modals
    const reminderModal = $('#reminder-modal');
    const uploadModal = $('#upload-modal');
    const modalTitle = $('#modal-title');
    const modalClose = $('#modal-close');

    // Upload Elements
    const uploadZone = $('#upload-zone');
    const fileInput = $('#file-input');
    const previewArea = $('#preview-area');
    const previewImg = $('#preview-img');
    const captionInput = $('#caption-input');
    const charCount = $('#char-count');
    const sendBtn = $('#send-btn');

    // Other elements
    const scheduleTimeline = $('#schedule-timeline');
    const heartPulseBtn = $('#heart-pulse-btn');
    const pulseLabel = $('#pulse-label');
    const toast = $('#toast');
    const toastText = $('#toast-text');
    const toastIcon = $('#toast-icon');

    // ── MOCK DATA ──
    const scheduleItems = [
        {
            timeStr: '08:00',
            ampm: 'AM',
            title: 'ทานยาเช้า',
            subtitle: 'ยาความดัน / แอสไพริน',
            icon: '💊',
            bgClass: 'icon-pill',
            status: 'done'
        },
        {
            timeStr: '10:00',
            ampm: 'AM',
            title: 'เดินออกกำลังกาย',
            subtitle: 'สวนสาธารณะหน้าหมู่บ้าน',
            icon: '🚶',
            bgClass: 'icon-walk',
            status: 'in-progress',
            statusText: 'กำลังทำ'
        },
        {
            timeStr: '11:30',
            ampm: 'AM',
            title: 'กายภาพบำบัด',
            subtitle: 'กับพยาบาลแอนนา (เหลือ 20 นาที)',
            icon: '💆',
            bgClass: 'icon-therapy',
            status: 'pending'
        },
        {
            timeStr: '13:00',
            ampm: 'PM',
            title: 'อาหารกลางวัน',
            subtitle: 'ข้าวต้มปลา',
            icon: '🍲',
            bgClass: 'icon-lunch',
            status: 'pending'
        }
    ];

    const feedItems = [
        {
            type: 'photo',
            caption: 'วันนี้อากาศดีมากเลยค่ะ ☀️',
            time: '10 นาทีที่แล้ว',
            status: 'viewed',
            emoji: '📷'
        },
        {
            type: 'pulse',
            caption: '❤️ ส่งความคิดถึง',
            time: '2 ชั่วโมงที่แล้ว',
            status: 'viewed',
            emoji: '💗'
        }
    ];

    const activityData = [
        {
            date: 'วันนี้',
            views: '3/5',
            events: [
                { icon: '💊', text: 'ทานยาเช้า', time: '08:05' },
                { icon: '🚶', text: 'เริ่มเดินออกกำลังกาย', time: '10:02' }
            ]
        }
    ];

    // ── SPLASH SCREEN ──
    function initSplash() {
        setTimeout(() => {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
                app.classList.remove('hidden');
                app.classList.add('visible');
            }, 600);
        }, 2200);
    }

    // ── RENDER ──
    function renderSchedule() {
        if (!scheduleTimeline) return;
        scheduleTimeline.innerHTML = scheduleItems.map(item => {
            let statusHtml = '';
            if (item.status === 'done') {
                statusHtml = `<div class="item-status"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>`;
            } else if (item.status === 'in-progress') {
                statusHtml = `<div class="status-badge">${item.statusText}</div>`;
            }

            return `
                <div class="timeline-item">
                    <div class="time-col">
                        <span class="time-val">${item.timeStr}</span>
                        <span class="time-ampm">${item.ampm}</span>
                    </div>
                    <div class="content-col">
                        <div class="item-card">
                            <div class="item-icon ${item.bgClass}">${item.icon}</div>
                            <div class="item-details">
                                <div class="item-title">${item.title}</div>
                                <div class="item-subtitle">${item.subtitle}</div>
                            </div>
                            ${statusHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderFeed() {
        const feedList = $('#feed-list');
        if (!feedList) return;
        const statusLabels = { viewed: '✅ ดูแล้ว', sent: '📤 ส่งแล้ว', scheduled: '⏰ ตั้งเวลา' };

        feedList.innerHTML = feedItems.map((item, i) => `
            <div class="feed-item" style="animation-delay: ${i * 0.08}s">
                <div class="feed-thumb ${item.type}">${item.emoji}</div>
                <div class="feed-body">
                    <p class="feed-caption">${item.caption}</p>
                    <div class="feed-meta">
                        <span>${item.time}</span>
                        <span class="feed-status ${item.status}">${statusLabels[item.status]}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderActivity() {
        const activityTimeline = $('#activity-timeline');
        if (!activityTimeline) return;
        activityTimeline.innerHTML = activityData.map(day => `
            <div class="activity-day">
                <div class="activity-day-header">
                    <span class="activity-date">${day.date}</span>
                </div>
                <div class="activity-events">
                    ${day.events.map(ev => `
                        <div class="activity-event">
                            <span class="activity-event-icon">${ev.icon}</span>
                            <span>${ev.text}</span>
                            <span class="activity-event-time" style="margin-left:auto;">${ev.time}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    let currentUploadType = 'message';

    // ── ACTIONS & MODALS ──
    window.openActionModal = function (type) {
        currentUploadType = type;
        if (!uploadModal) return;

        modalTitle.textContent = type === 'photo' ? 'ส่งรูปภาพ' : 'ส่งข้อความ';

        // Reset state
        previewArea.classList.add('hidden');
        previewImg.classList.add('hidden');
        captionInput.value = '';
        charCount.textContent = '0';

        if (type === 'message') {
            uploadZone.classList.add('hidden');
        } else {
            uploadZone.classList.remove('hidden');
            fileInput.accept = 'image/*';
        }

        uploadModal.classList.add('open');
    };

    window.closeUploadModal = function () {
        if (uploadModal) uploadModal.classList.remove('open');
    };

    // ── FILE UPLOAD ──
    function handleFileSelect(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        showPreview(file);
    }

    function showPreview(file) {
        previewArea.classList.remove('hidden');
        uploadZone.classList.add('hidden');

        const url = URL.createObjectURL(file);
        if (file.type.startsWith('image/')) {
            previewImg.src = url;
            previewImg.classList.remove('hidden');
        }
    }

    // ── SEND CONTENT ──
    function sendContent() {
        const caption = captionInput.value.trim() || (currentUploadType === 'photo' ? 'ส่งรูปภาพ 📷' : 'ส่งข้อความ 💬');

        // Check if we are in chat mode
        if (document.body.classList.contains('chat-active')) {
            if (currentUploadType === 'photo' && previewImg && !previewImg.classList.contains('hidden')) {
                window.sendChatMessage('photo', previewImg.src);
            } else {
                // Fallback
                if (chatInputText) chatInputText.value = caption;
                window.sendChatMessage();
            }
        } else {
            // Fallback to original feed logic
            feedItems.unshift({
                type: currentUploadType,
                caption,
                time: 'เมื่อสักครู่',
                status: 'sent',
                emoji: currentUploadType === 'photo' ? '📷' : '💬'
            });

            renderFeed();
            showToast('✅', 'ส่งข้อความสำเร็จ!');
        }

        window.closeUploadModal();
    }

    // ── CAPTION INPUT ──
    function handleCaptionInput() {
        charCount.textContent = captionInput.value.length;
    }

    window.openReminderModal = function () {
        if (reminderModal) {
            reminderModal.classList.add('open');
        }
    };

    window.closeReminderModal = function () {
        if (reminderModal) {
            reminderModal.classList.remove('open');
        }
    };

    window.saveReminder = function () {
        const title = $('#remind-title').value.trim() || 'แจ้งเตือนใหม่';
        const time = $('#remind-time').value || '12:00';

        // Add to schedule at top
        scheduleItems.unshift({
            timeStr: time,
            ampm: parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM',
            title: title,
            subtitle: 'ตั้งค่าโดยคุณ',
            icon: '⏰',
            bgClass: 'icon-pill',
            status: 'pending'
        });

        renderSchedule();
        closeReminderModal();
        showToast('✅', 'บันทึกแจ้งเตือนแล้ว!');
    };

    function handleHeartPulse() {
        if (!heartPulseBtn) return;
        heartPulseBtn.classList.add('pulsing');
        pulseLabel.textContent = '💕 ส่งความห่วงใยแล้ว!';
        pulseLabel.classList.add('sent');

        showToast('❤️', 'ส่งความห่วงใยแล้ว!');

        feedItems.unshift({
            type: 'pulse',
            caption: '❤️ ส่งความคิดถึง',
            time: 'เมื่อสักครู่',
            status: 'sent',
            emoji: '💗'
        });
        renderFeed();

        setTimeout(() => {
            heartPulseBtn.classList.remove('pulsing');
            pulseLabel.textContent = 'แตะเพื่อส่งความห่วงใยด่วน';
            pulseLabel.classList.remove('sent');
        }, 3000);
    }

    function showToast(icon, text) {
        toastIcon.textContent = icon;
        toastText.textContent = text;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 2800);
    }

    // ── BOTTOM NAV ──
    function handleNavTab(e) {
        const btn = e.target.closest('.bnav-item');
        if (!btn) return;

        $$('.bnav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;

        // Hide all tabs
        $$('.tab-content').forEach(t => t.classList.add('hidden'));

        // Show selected tab
        const activeTab = $('#tab-' + tab);
        if (activeTab) {
            activeTab.classList.remove('hidden');
        } else {
            // Unimplemented tabs
            showToast('🚧', 'หน้านี้อยู่ระหว่างพัฒนา');
            $('#tab-home').classList.remove('hidden');
            $$('.bnav-item').forEach(b => b.classList.remove('active'));
            $$('.bnav-item[data-tab="home"]')[0].classList.add('active');
        }

        // Add class to body if chat is active so we can pad the bottom nav
        if (tab === 'chat') {
            document.body.classList.add('chat-active');
            scrollToBottom();
        } else {
            document.body.classList.remove('chat-active');
        }
    }

    // ── CHAT LOGIC ──
    const chatInputText = $('#chat-input-text');
    const chatMessages = $('#chat-messages');

    window.sendChatMessage = function (mediaType, mediaUrl) {
        let text = chatInputText ? chatInputText.value.trim() : '';

        // Handle media uploads from the modal
        if (mediaType === 'photo') {
            text = 'ส่งรูปภาพ 📷';
        }

        if (!text) return;

        // Append sent message
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        let mediaHtml = '';
        if (mediaType === 'photo' && mediaUrl) {
            mediaHtml = `<img src="${mediaUrl}" style="max-width: 100%; border-radius: 8px; margin-top: 8px;">`;
        }

        const msgHtml = `
            <div class="message-bubble sent">
                <div class="bubble-text">${text}${mediaHtml}</div>
                <div class="bubble-time">${timeStr}</div>
            </div>
        `;

        if (chatMessages) {
            chatMessages.insertAdjacentHTML('beforeend', msgHtml);
            scrollToBottom();
        }

        if (chatInputText) chatInputText.value = '';

        // Simulate reply
        setTimeout(() => {
            const replyHtml = `
                <div class="message-bubble received">
                    <div class="bubble-text">ขอบใจจ้าลูกยายเห็นแล้วนะ ❤️</div>
                    <div class="bubble-time">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            `;
            if (chatMessages) {
                chatMessages.insertAdjacentHTML('beforeend', replyHtml);
                scrollToBottom();
            }
        }, 2000);
    };

    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // ── INIT ──
    function bindEvents() {
        // Nav
        const bNav = $('#bottom-nav');
        if (bNav) bNav.addEventListener('click', handleNavTab);

        // Modals
        $$('.reminder-close').forEach(btn => btn.addEventListener('click', closeReminderModal));
        if (reminderModal) {
            reminderModal.addEventListener('click', e => {
                if (e.target === reminderModal) closeReminderModal();
            });
        }

        if (modalClose) modalClose.addEventListener('click', window.closeUploadModal);
        if (uploadModal) {
            uploadModal.addEventListener('click', (e) => {
                if (e.target === uploadModal) window.closeUploadModal();
            });
        }

        // File Upload
        const uploadDropZone = $('#upload-drop-zone');
        if (uploadDropZone) uploadDropZone.addEventListener('click', () => fileInput.click());
        if (fileInput) fileInput.addEventListener('change', handleFileSelect);
        if (sendBtn) sendBtn.addEventListener('click', sendContent);
        if (captionInput) captionInput.addEventListener('input', handleCaptionInput);

        // Heart Pulse
        if (heartPulseBtn) heartPulseBtn.addEventListener('click', handleHeartPulse);
    }

    function init() {
        initSplash();
        renderSchedule();
        renderFeed();
        renderActivity();
        bindEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
