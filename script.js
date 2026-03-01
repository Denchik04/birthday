document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ЛОГІКА ВСТУПНОГО ВІДЕО ТА МУЗИКИ
    // ==========================================
    const introOverlay = document.getElementById('intro-overlay');
    const startBtn = document.getElementById('start-btn');
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-btn'); 
    const bgMusic = document.getElementById('bgMusic');

    function finishIntro() {
        if (introVideo) introVideo.pause(); 
        if (introOverlay) introOverlay.style.opacity = '0';
        setTimeout(() => {
            if (introOverlay) introOverlay.style.display = 'none';
        }, 1500);
    }

    if (startBtn && introVideo) {
        startBtn.addEventListener('click', () => {
            startBtn.style.display = 'none';
            introVideo.classList.remove('hidden');
            if(skipBtn) skipBtn.classList.remove('hidden'); 
            introVideo.play().catch(e => console.log(e));
        });

        introVideo.addEventListener('ended', finishIntro);
        
        if(skipBtn) {
            skipBtn.addEventListener('click', finishIntro);
        }
    }

    // ==========================================
    // 2. Анімація появи тексту
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ==========================================
    // 3. Дані фотографій (Твої оригінальні підписи)
    // ==========================================
    const photosData = [
        { file: "2.jpg", text: "Початок..." },
        { file: "3.jpg", text: "Пам'ятаєш цей вечір?" },
        { file: "1.jpg", text: "Моя улюблена твоя посмішка" },
        { file: "4.jpg", text: "Просто ми" },
        { file: "5.jpg", text: "Ти тут така красива" },
        { file: "6.jpg", text: "Красівенькі ми" },
        { file: "7.jpg", text: "Ржем" },
        { file: "8.jpg", text: "Найтепліші обійми(я тут не оч, але як є)" },
        { file: "9.jpg", text: "Твої очі..." },
        { file: "10.jpg", text: "Котики" },
        { file: "11.jpg", text: "Ніжні моменти" },
        { file: "12.jpg", text: "Моя мила" },
        { file: "13.jpg", text: "🥰" },
        { file: "14.jpg", text: "Моя прекрасана" },
        { file: "15.jpg", text: "Умнічкою ти теж була)" },
        { file: "16.jpg", text: "Сердечко намальоване з любов'ю)" },
        { file: "17.jpg", text: "Далі буде тільки краще ❤️" },
    ];

    // ==========================================
    // СИСТЕМА БУФЕРИЗАЦІЇ (ПРЕЛОАДЕР)
    // ==========================================
    const loaderOverlay = document.getElementById('loader-overlay');
    let assetsLoaded = 0;
    const totalAssets = photosData.length + 1; // 17 фото + 1 відео

    function assetLoaded() {
        assetsLoaded++;
        // Коли завантажилось ВСЕ (або спрацював таймер)
        if (assetsLoaded >= totalAssets) {
            setTimeout(() => {
                if (loaderOverlay) {
                    loaderOverlay.style.opacity = '0';
                    setTimeout(() => loaderOverlay.style.display = 'none', 800);
                }
            }, 500); // Маленька затримка для плавності
        }
    }

    // 1. Примусово вантажимо всі фото в кеш
    photosData.forEach(photo => {
        const img = new Image();
        img.onload = assetLoaded;
        img.onerror = assetLoaded; // Якщо якась фотка збилась, не блокуємо сайт
        img.src = photo.file;
    });

    // 2. Чекаємо, поки відео підвантажить достатньо даних для відтворення
    if (introVideo) {
        introVideo.oncanplaythrough = assetLoaded;
        introVideo.onerror = assetLoaded;
        
        // ЗАПОБІЖНИК: Якщо в неї слабкий інтернет, чекаємо максимум 6 секунд і пускаємо
        setTimeout(() => {
            if (assetsLoaded < totalAssets) {
                assetsLoaded = totalAssets; // Штучно кажемо, що все готово
                assetLoaded();
            }
        }, 6000);
    } else {
        assetLoaded();
    }

    // ==========================================
    // 4. МІНІ-ГРА: СКРЕТЧ-КАРТА
    // ==========================================
    const canvas = document.getElementById('scratch-canvas');
    const gallerySection = document.getElementById('gallery-section');
    const galleryTrack = document.getElementById('gallery-track');
    const timeCapsuleSection = document.getElementById('time-capsule');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let isUnlocked = false;

        canvas.width = canvas.offsetWidth || 350;
        canvas.height = canvas.offsetHeight || 220;

        ctx.fillStyle = '#d4a39b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = 'italic 24px "Cormorant Garamond", serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Зітри мене 🤍', canvas.width / 2, canvas.height / 2);

        ctx.globalCompositeOperation = 'destination-out';

        function getMousePos(evt) {
            const rect = canvas.getBoundingClientRect();
            let clientX = evt.clientX;
            let clientY = evt.clientY;
            
            if (evt.touches && evt.touches.length > 0) {
                clientX = evt.touches[0].clientX;
                clientY = evt.touches[0].clientY;
            }
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function scratch(evt) {
            if (!isDrawing || isUnlocked) return;
            evt.preventDefault();
            const pos = getMousePos(evt);
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI); 
            ctx.fill();
            
            checkProgress();
        }

        canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', () => { isDrawing = false; });
        canvas.addEventListener('mouseleave', () => { isDrawing = false; });

        canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, {passive: false});
        canvas.addEventListener('touchmove', scratch, {passive: false});
        canvas.addEventListener('touchend', () => { isDrawing = false; });

        function checkProgress() {
            if (isUnlocked) return;
            
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let cleared = 0;
            
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) cleared++;
            }
            
            const percentage = (cleared / (pixels.length / 4)) * 100;
            
            if (percentage > 50) {
                isUnlocked = true;
                canvas.style.opacity = '0';
                setTimeout(() => canvas.style.display = 'none', 800);
                
                if (bgMusic) {
                    bgMusic.volume = 0.5;
                    bgMusic.play().catch(e => console.log(e));
                }
                if (navigator.vibrate) navigator.vibrate([40, 50, 40]);
                
                if (gallerySection) {
                    gallerySection.classList.remove('hidden');
                    buildGallery();
                    
                    setTimeout(() => {
                        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        
                        // Відкриваємо Капсулу Часу внизу галереї
                        setTimeout(() => {
                            if(timeCapsuleSection) timeCapsuleSection.classList.remove('hidden');
                        }, 1500);

                    }, 1800); 
                }
            }
        }
    }

    // ==========================================
    // 5. Функція генерації галереї
    // ==========================================
    function buildGallery() {
        if (!galleryTrack) return;
        galleryTrack.innerHTML = ''; 
        
        photosData.forEach((photo, index) => {
            const card = document.createElement('div');
            card.className = 'photo-card';
            
            const rotation = index % 2 === 0 ? '-2deg' : '3deg';
            card.style.setProperty('--rot', rotation);

            card.innerHTML = `
                <div class="img-box"><img src="${photo.file}" alt="Спогад"></div>
                <p class="caption">${photo.text}</p>
            `;
            
            galleryTrack.appendChild(card);
        });

        const photoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.photo-card').forEach(card => photoObserver.observe(card));
    }

    // ==========================================
    // 6. КАПСУЛА ЧАСУ (TELEGRAM BOT API З ФІКСОМ CORS)
    // ==========================================
    const sendBtn = document.getElementById('send-capsule-btn');
    const capsuleText = document.getElementById('capsule-text');
    const successMsg = document.getElementById('capsule-success');

    // !!! ВАЖЛИВО: ВСТАВ СЮДИ СВОЇ ДАНІ, ІНАКШЕ НЕ ЗАПРАЦЮЄ !!!
    const BOT_TOKEN = '8788360650:AAEruImFKVZUJ73BlPkn60HljgnANfu81aA';
    const CHAT_ID = '1315357550'; 

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const message = capsuleText.value.trim();
            
            if (message === '') {
                alert('Напиши хоча б пару слів! 🤍');
                return;
            }

            sendBtn.innerText = 'Відправляю... ⏳';
            sendBtn.disabled = true;

            const textForTelegram = `⏳ *КАПСУЛА ЧАСУ: Не відкривати до 02.03.2027!* ⏳\n\n📝 *Її лист:*\n_${message}_\n\n💌 _Відправлено з нашої Подорожі Спогадами_`;

            // ФІКС CORS: Збираємо дані як просту форму, а не JSON
            const urlParams = new URLSearchParams();
            urlParams.append('chat_id', CHAT_ID);
            urlParams.append('text', textForTelegram);
            urlParams.append('parse_mode', 'Markdown');

            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                body: urlParams 
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    sendBtn.classList.add('hidden');
                    capsuleText.classList.add('hidden');
                    successMsg.classList.remove('hidden');
                } else {
                    alert('Помилка від Telegram: ' + data.description);
                    sendBtn.innerText = 'Запечатати і відправити ✈️';
                    sendBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Помилка API Telegram:', error);
                alert('Помилка з\'єднання. Перевір інтернет!');
                sendBtn.innerText = 'Запечатати і відправити ✈️';
                sendBtn.disabled = false;
            });
        });
    }

});

