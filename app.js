/* ============================================================
   HeartLink Family MVP — Interactive Mockup
   ============================================================
   Features:
   - Splash screen animation
   - Heart Pulse with spring animation
   - Upload modal (photo/voice/video/text)
   - Voice recorder simulation
   - Content feed with mock data
   - Simulated activity log
   - Schedule modal
   - Toast notifications
   - Bottom nav tab switching
   ============================================================ */

(function () {
    'use strict';

    // ── DOM REFS ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const splash = $('#splash-screen');
    const app = $('#app');
    const heartPulseBtn = $('#heart-pulse-btn');
    const pulseLabel = $('#pulse-label');
    const uploadModal = $('#upload-modal');
    const scheduleModal = $('#schedule-modal');
    const modalTitle = $('#modal-title');
    const modalClose = $('#modal-close');
    const uploadZone = $('#upload-zone');
    const voiceRecorder = $('#voice-recorder');
    const uploadDropZone = $('#upload-drop-zone');
    const fileInput = $('#file-input');
    const previewArea = $('#preview-area');
    const previewImg = $('#preview-img');
    const previewVideo = $('#preview-video');
    const previewAudio = $('#preview-audio');
    const captionInput = $('#caption-input');
    const charCount = $('#char-count');
    const sendBtn = $('#send-btn');
    const scheduleBtn = $('#schedule-btn');
    const scheduleConfirm = $('#schedule-confirm');
    const recordBtn = $('#record-btn');
    const recordDot = $('#record-dot');
    const recordLabel = $('#record-label');
    const recorderTimer = $('#recorder-timer');
    const visualizerBars = $('.visualizer-bars');
    const feedList = $('#feed-list');
    const activityTimeline = $('#activity-timeline');
    const toast = $('#toast');
    const toastText = $('#toast-text');
    const toastIcon = $('#toast-icon');
    const streakCount = $('#streak-count');

    let currentUploadType = 'photo';
    let isRecording = false;
    let recordInterval = null;
    let recordSeconds = 0;

    // ── MOCK DATA ──
    const feedItems = [
        {
            type: 'photo',
            caption: 'วันนี้อากาศดีมากเลยค่ะ ☀️',
            time: '10 นาทีที่แล้ว',
            status: 'viewed',
            emoji: '📷'
        },
        {
            type: 'voice',
            caption: 'ข้อความเสียง (15 วินาที)',
            time: '2 ชั่วโมงที่แล้ว',
            status: 'viewed',
            emoji: '🎙'
        },
        {
            type: 'video',
            caption: 'หลานอรุณ กำลังเล่นที่โรงเรียน 🎒',
            time: '5 ชั่วโมงที่แล้ว',
            status: 'sent',
            emoji: '🎬'
        },
        {
            type: 'pulse',
            caption: '❤️ ส่งความคิดถึง',
            time: 'เมื่อวานนี้ 21:30',
            status: 'viewed',
            emoji: '💗'
        },
        {
            type: 'photo',
            caption: 'ทำข้าวผัดให้ยายชิมค่ะ 🍚',
            time: 'เมื่อวานนี้ 18:00',
            status: 'viewed',
            emoji: '📷'
        },
        {
            type: 'video',
            caption: 'สวัสดีตอนเช้าค่ะยาย!',
            time: '2 วันที่แล้ว 07:00',
            status: 'viewed',
            emoji: '🎬'
        },
        {
            type: 'voice',
            caption: 'ข้อความเสียง (8 วินาที)',
            time: '2 วันที่แล้ว 20:15',
            status: 'scheduled',
            emoji: '🎙'
        }
    ];

    const activityData = [
        {
            date: 'วันนี้',
            views: '3/5',
            events: [
                { icon: '👁', text: 'ดูรูปถ่ายอากาศดี', time: '08:45' },
                { icon: '😊', text: 'ยิ้มขณะฟังข้อความเสียง', time: '09:12' },
                { icon: '👁', text: 'ดูวิดีโอหลานอรุณ 2 ครั้ง', time: '10:30' }
            ]
        },
        {
            date: 'เมื่อวานนี้',
            views: '5/5',
            events: [
                { icon: '❤️', text: 'รับ Heart Pulse แล้วยิ้ม', time: '21:32' },
                { icon: '👁', text: 'ดูรูปข้าวผัด', time: '18:05' },
                { icon: '🔁', text: 'เปิดดูวิดีโอซ้ำ 3 รอบ', time: '19:00' },
                { icon: '😴', text: 'เข้านอน', time: '21:45' }
            ]
        },
        {
            date: '2 วันที่แล้ว',
            views: '4/4',
            events: [
                { icon: '☀️', text: 'ตื่นนอนและดูสวัสดีตอนเช้า', time: '06:50' },
                { icon: '👁', text: 'ฟังข้อความเสียง', time: '08:00' },
                { icon: '🚶', text: 'เดินผ่านหน้าจอ 4 ครั้ง', time: 'ทั้งวัน' }
            ]
        }
    ];

    const modalTitles = {
        photo: 'ส่งรูปภาพ',
        voice: 'บันทึกเสียง',
        video: 'ส่งวิดีโอ',
        text: 'ส่งข้อความ'
    };

    const statusLabels = {
        viewed: '✅ ดูแล้ว',
        sent: '📤 ส่งแล้ว',
        scheduled: '⏰ ตั้งเวลา'
    };

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

    // ── RENDER FEED ──
    function renderFeed() {
        feedList.innerHTML = feedItems.map((item, i) => `
            <div class="feed-item" style="animation-delay: ${i * 0.08}s">
                <div class="feed-thumb ${item.type}">
                    ${item.emoji}
                </div>
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

    // ── RENDER ACTIVITY ──
    function renderActivity() {
        activityTimeline.innerHTML = activityData.map(day => `
            <div class="activity-day">
                <div class="activity-day-header">
                    <span class="activity-date">${day.date}</span>
                    <span class="activity-views">👁 ${day.views} ดูแล้ว</span>
                </div>
                <div class="activity-events">
                    ${day.events.map(ev => `
                        <div class="activity-event">
                            <span class="activity-event-icon">${ev.icon}</span>
                            <span>${ev.text}</span>
                            <span class="activity-event-time">${ev.time}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // ── HEART PULSE ──
    function handleHeartPulse() {
        heartPulseBtn.classList.add('pulsing');
        pulseLabel.textContent = '💕 ส่งความคิดถึงแล้ว!';
        pulseLabel.classList.add('sent');

        showToast('❤️', 'ส่งความคิดถึงถึงคุณยายแล้ว!');

        // Add to feed
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
            pulseLabel.textContent = 'แตะเพื่อส่งความคิดถึง';
            pulseLabel.classList.remove('sent');
        }, 3000);
    }

    // ── UPLOAD MODAL ──
    function openUploadModal(type) {
        currentUploadType = type;
        modalTitle.textContent = modalTitles[type];

        // Reset state
        previewArea.classList.add('hidden');
        previewImg.classList.add('hidden');
        previewVideo.classList.add('hidden');
        previewAudio.classList.add('hidden');
        captionInput.value = '';
        charCount.textContent = '0';

        if (type === 'voice') {
            uploadZone.classList.add('hidden');
            voiceRecorder.classList.remove('hidden');
            resetRecorder();
        } else {
            uploadZone.classList.remove('hidden');
            voiceRecorder.classList.add('hidden');
            if (type === 'text') {
                uploadZone.classList.add('hidden');
            }
            fileInput.accept = type === 'photo' ? 'image/*' : 'video/*';
        }

        uploadModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeUploadModal() {
        uploadModal.classList.remove('open');
        document.body.style.overflow = '';
        stopRecording();
    }

    function closeScheduleModal() {
        scheduleModal.classList.remove('open');
    }

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
        } else if (file.type.startsWith('video/')) {
            previewVideo.src = url;
            previewVideo.classList.remove('hidden');
        }
    }

    // ── VOICE RECORDER ──
    function toggleRecording() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    function startRecording() {
        isRecording = true;
        recordSeconds = 0;
        recordBtn.classList.add('recording');
        recordLabel.textContent = 'แตะเพื่อหยุด';
        visualizerBars.classList.add('active');

        recordInterval = setInterval(() => {
            recordSeconds++;
            const mins = Math.floor(recordSeconds / 60);
            const secs = recordSeconds % 60;
            recorderTimer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

            if (recordSeconds >= 60) {
                stopRecording();
            }
        }, 1000);
    }

    function stopRecording() {
        isRecording = false;
        clearInterval(recordInterval);
        recordBtn.classList.remove('recording');
        recordLabel.textContent = 'แตะเพื่อบันทึก';
        visualizerBars.classList.remove('active');
    }

    function resetRecorder() {
        stopRecording();
        recordSeconds = 0;
        recorderTimer.textContent = '0:00';
    }

    // ── SEND CONTENT ──
    function sendContent() {
        const caption = captionInput.value.trim() || getDefaultCaption();

        feedItems.unshift({
            type: currentUploadType,
            caption,
            time: 'เมื่อสักครู่',
            status: 'sent',
            emoji: getTypeEmoji(currentUploadType)
        });

        renderFeed();
        closeUploadModal();
        showToast('✅', 'ส่งความรักสำเร็จ!');

        // Update streak
        const current = parseInt(streakCount.textContent);
        streakCount.textContent = current + 1;
    }

    function scheduleContent() {
        closeUploadModal();

        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateInput = $('#schedule-date');
        dateInput.value = tomorrow.toISOString().split('T')[0];

        scheduleModal.classList.add('open');
    }

    function confirmSchedule() {
        const caption = captionInput?.value?.trim() || 'เนื้อหาตั้งเวลาส่ง';

        feedItems.unshift({
            type: currentUploadType,
            caption: `⏰ ${caption}`,
            time: 'ตั้งเวลาส่ง 07:00 พรุ่งนี้',
            status: 'scheduled',
            emoji: getTypeEmoji(currentUploadType)
        });

        renderFeed();
        closeScheduleModal();
        showToast('⏰', 'ตั้งเวลาส่งสำเร็จ!');
    }

    function getDefaultCaption() {
        const captions = {
            photo: 'ส่งรูปภาพ 📷',
            voice: `ข้อความเสียง (${recordSeconds} วินาที)`,
            video: 'ส่งวิดีโอ 🎬',
            text: captionInput.value || 'ส่งข้อความ 💬'
        };
        return captions[currentUploadType];
    }

    function getTypeEmoji(type) {
        return { photo: '📷', voice: '🎙', video: '🎬', text: '💬', pulse: '💗' }[type] || '📎';
    }

    // ── QUICK MESSAGES ──
    function handleQuickMsg(e) {
        const msg = e.target.dataset.msg;
        if (msg) {
            captionInput.value = msg;
            charCount.textContent = msg.length;
        }
    }

    // ── TOAST ──
    function showToast(icon, text) {
        toastIcon.textContent = icon;
        toastText.textContent = text;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    // ── DRAG & DROP ──
    function setupDragDrop() {
        uploadDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadDropZone.classList.add('dragover');
        });

        uploadDropZone.addEventListener('dragleave', () => {
            uploadDropZone.classList.remove('dragover');
        });

        uploadDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadDropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) showPreview(file);
        });
    }

    // ── BOTTOM NAV ──
    function handleNavTab(e) {
        const btn = e.target.closest('.bnav-item');
        if (!btn) return;

        $$('.bnav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;

        // Show/hide sections based on tab
        const sections = {
            home: ['parent-section', 'pulse-section', 'actions-section', 'feed-section'],
            schedule: ['feed-section'],
            activity: ['parent-section', 'activity-section'],
            settings: []
        };

        const allSections = ['parent-section', 'pulse-section', 'actions-section', 'feed-section', 'activity-section'];

        allSections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (sections[tab]?.includes(id)) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            }
        });

        if (tab === 'settings') {
            showToast('⚙️', 'ตั้งค่า (อยู่ระหว่างพัฒนา)');
        }
    }

    // ── CAPTION INPUT ──
    function handleCaptionInput() {
        charCount.textContent = captionInput.value.length;
    }

    // ── EVENT LISTENERS ──
    function bindEvents() {
        // Heart Pulse
        heartPulseBtn.addEventListener('click', handleHeartPulse);

        // Action buttons
        $$('.action-card').forEach(btn => {
            btn.addEventListener('click', () => {
                openUploadModal(btn.dataset.type);
            });
        });

        // Modal
        modalClose.addEventListener('click', closeUploadModal);
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) closeUploadModal();
        });

        // Schedule modal close
        $$('.schedule-close').forEach(btn => {
            btn.addEventListener('click', closeScheduleModal);
        });
        scheduleModal.addEventListener('click', (e) => {
            if (e.target === scheduleModal) closeScheduleModal();
        });

        // File upload
        uploadDropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);
        setupDragDrop();

        // Voice recorder
        recordBtn.addEventListener('click', toggleRecording);

        // Send / Schedule
        sendBtn.addEventListener('click', sendContent);
        scheduleBtn.addEventListener('click', scheduleContent);
        scheduleConfirm.addEventListener('click', confirmSchedule);

        // Quick messages
        $$('.quick-msg').forEach(btn => {
            btn.addEventListener('click', handleQuickMsg);
        });

        // Caption
        captionInput.addEventListener('input', handleCaptionInput);

        // Bottom nav
        $('#bottom-nav').addEventListener('click', handleNavTab);

        // Keyboard: Escape closes modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeUploadModal();
                closeScheduleModal();
            }
        });
    }

    // ── INIT ──
    function init() {
        initSplash();
        renderFeed();
        renderActivity();
        bindEvents();

        // Set today's date as min for schedule
        const dateInput = $('#schedule-date');
        if (dateInput) {
            dateInput.min = new Date().toISOString().split('T')[0];
        }
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
