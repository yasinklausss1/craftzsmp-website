// ==========================================
// CRAFTZ WEBSITE - AUTHENTIC MINECRAFT FEEL
// Real 2011-2014 Minecraft vibes
// ==========================================

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// ==========================================
// COPY SERVER IP - Minecraft Style Feedback
// ==========================================
function copyIP() {
    const ipElement = document.getElementById('serverIP');
    const ipAddress = (ipElement && ipElement.getAttribute('data-ip')) || 'craftz.cybrancee.games';

    // Try Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ipAddress).then(() => {
            showCopySuccess(ipElement);
        }).catch(() => {
            fallbackCopy(ipAddress, ipElement);
        });
    } else {
        fallbackCopy(ipAddress, ipElement);
    }
}

function fallbackCopy(text, ipEl) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showCopySuccess(ipEl);
    } catch (err) {
        alert('Kopieren fehlgeschlagen. Bitte manuell kopieren: ' + text);
    }

    document.body.removeChild(textarea);
}

function showCopySuccess(ipEl) {
    if (!ipEl) return;
    const originalText = ipEl.getAttribute('data-ip') || 'craftz.cybrancee.games';
    const borderBox = ipEl.closest('.grass-block-border');

    // Change IP text temporarily
    ipEl.textContent = '✓ Kopiert!';
    ipEl.classList.add('copied');

    if (borderBox) {
        borderBox.classList.add('copied');
        borderBox.style.transform = 'translate(2px, 2px) scale(1.02)';
        setTimeout(() => {
            borderBox.style.transform = '';
        }, 150);
        createFloatingText('IP kopiert!', borderBox);
    } else {
        createFloatingText('IP kopiert!', ipEl);
    }

    // Reset after 2 seconds
    clearTimeout(window._copyTimeout);
    window._copyTimeout = setTimeout(() => {
        ipEl.textContent = originalText;
        ipEl.classList.remove('copied');
        if (borderBox) {
            borderBox.classList.remove('copied');
        }
    }, 2000);
}

// ==========================================
// COPY JOIN FIELD (Servername, IP, Port)
// ==========================================
function copyJoinField(text, element) {
    if (!element) return;
    const badge = element.querySelector('.copy-badge');
    const originalBadgeText = badge ? badge.textContent : 'Kopieren';

    const triggerSuccess = () => {
        if (badge) {
            badge.textContent = '✓ Kopiert!';
            badge.style.background = 'var(--diamond-cyan)';
            badge.style.color = '#0D0D0D';
            badge.style.borderColor = '#0D0D0D';
        }
        element.style.borderColor = 'var(--diamond-cyan)';
        createFloatingText(text + ' kopiert!', element);

        setTimeout(() => {
            if (badge) {
                badge.textContent = originalBadgeText;
                badge.style.background = '';
                badge.style.color = '';
                badge.style.borderColor = '';
            }
            element.style.borderColor = '';
        }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(triggerSuccess).catch(() => {
            fallbackCopyJoin(text, triggerSuccess);
        });
    } else {
        fallbackCopyJoin(text, triggerSuccess);
    }
}

function fallbackCopyJoin(text, onSuccess) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        if (onSuccess) onSuccess();
    } catch (err) {
        alert('Kopieren: ' + text);
    }

    document.body.removeChild(textarea);
}

// ==========================================
// FLOATING TEXT ANIMATION (Minecraft Damage Numbers Style)
// ==========================================
function createFloatingText(text, element) {
    const float = document.createElement('div');
    float.textContent = text;
    float.style.position = 'fixed';
    float.style.fontFamily = "'Silkscreen', 'Mojangles', monospace";
    float.style.color = '#E8C584';
    float.style.fontWeight = 'bold';
    float.style.fontSize = '16px';
    float.style.textShadow = '2px 2px 0 #000';
    float.style.pointerEvents = 'none';
    float.style.zIndex = '10000';
    float.style.transition = 'all 1s ease-out';

    const rect = element.getBoundingClientRect();
    float.style.left = rect.left + rect.width / 2 - 50 + 'px';
    float.style.top = rect.top - 20 + 'px';

    document.body.appendChild(float);

    // Animate upwards and fade
    setTimeout(() => {
        float.style.transform = 'translateY(-50px)';
        float.style.opacity = '0';
    }, 10);

    // Remove after animation
    setTimeout(() => {
        float.remove();
    }, 1000);
}

// ==========================================
// ANIMATED COUNTER (Minecraft XP Style)
// ==========================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const hasPrefix = element.getAttribute('data-prefix');
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (target - startValue) * easeOut);

        if (hasPrefix) {
            element.textContent = hasPrefix + formatNumber(current);
        } else {
            element.textContent = formatNumber(current);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (hasPrefix) {
                element.textContent = hasPrefix + formatNumber(target);
            } else {
                element.textContent = formatNumber(target);
            }
        }
    }

    requestAnimationFrame(update);
}

function formatNumber(num) {
    return num.toLocaleString('de-DE');
}

// ==========================================
// INTERSECTION OBSERVER - Animate on Scroll
// ==========================================
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate counters
            if (entry.target.hasAttribute('data-target')) {
                animateCounter(entry.target);
                entry.target.removeAttribute('data-target');
            }

            // Animate feature boxes
            if (entry.target.classList.contains('feature-box')) {
                entry.target.style.animation = 'popIn 0.5s ease forwards';
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe stat numbers
const statElements = document.querySelectorAll('.stat-number');
statElements.forEach(stat => {
    observer.observe(stat);
});

// ==========================================
// LIVE SERVER STATS FETCHER (/api/stats)
// ==========================================
async function fetchServerStats() {
    try {
        const response = await fetch('/api/stats');
        if (!response.ok) return;
        const data = await response.json();

        // 1. Update Live Player Count & Status Pill
        const onlineCountEl = document.getElementById('onlineCount');
        if (onlineCountEl && typeof data.onlinePlayers === 'number') {
            onlineCountEl.textContent = data.onlinePlayers;
            const parentPill = onlineCountEl.closest('.stat-pill');
            if (parentPill) {
                if (data.online) {
                    parentPill.style.borderColor = 'rgba(74, 222, 128, 0.4)';
                    onlineCountEl.style.color = '#4ade80';
                } else {
                    parentPill.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                    onlineCountEl.style.color = '#94a3b8';
                }
            }
        }

        const playerCountEl = document.getElementById('playerCount');
        if (playerCountEl && typeof data.registeredPlayers === 'number') {
            playerCountEl.textContent = data.registeredPlayers;
        }

        // 2. Update Stats Data Targets
        const regEl = document.getElementById('statRegisteredPlayers');
        if (regEl && typeof data.registeredPlayers === 'number') {
            regEl.setAttribute('data-target', data.registeredPlayers);
            animateCounter(regEl);
        }

        const moneyEl = document.getElementById('statMoneyCirculation');
        if (moneyEl && typeof data.moneyCirculation === 'number') {
            moneyEl.setAttribute('data-target', data.moneyCirculation);
            animateCounter(moneyEl);
        }

        const questEl = document.getElementById('statQuestsCompleted');
        if (questEl && typeof data.questsCompleted === 'number') {
            questEl.setAttribute('data-target', data.questsCompleted);
            animateCounter(questEl);
        }

        const homesEl = document.getElementById('statHomesSet');
        if (homesEl && typeof data.homesSet === 'number') {
            homesEl.setAttribute('data-target', data.homesSet);
            animateCounter(homesEl);
        }
    } catch (e) {
        console.log('Error fetching stats:', e);
    }
}

// Fetch stats immediately and refresh every 30 seconds
fetchServerStats();
setInterval(fetchServerStats, 30000);

// Observe feature boxes
document.querySelectorAll('.feature-box').forEach((box, index) => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(40px) scale(0.95)';
    box.style.animationDelay = `${index * 0.1}s`;
    observer.observe(box);
});

// Add pop-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
        }
        50% {
            transform: translateY(-5px) scale(1.02);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// NAVIGATION SCROLL EFFECT
// ==========================================
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
    } else {
        nav.style.background = 'rgba(0, 0, 0, 0.85)';
        nav.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    }

    lastScroll = currentScroll;
});

// ==========================================
// MINECRAFT CLICK SOUND EFFECT (Visual Feedback)
// ==========================================
document.querySelectorAll('button, .discord-btn, .discord-join-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ==========================================
// RANDOM STEVE POSITION (Easter Egg)
// ==========================================
const steveContainer = document.querySelector('.steve-gif-container');
if (steveContainer) {
    setInterval(() => {
        const isMobile = window.innerWidth <= 768;
        const randomX = isMobile ? (Math.random() * 3 + 2) : (Math.random() * 20 + 5);
        steveContainer.style.right = randomX + '%';
        steveContainer.style.transition = 'all 3s ease-in-out';
    }, 8000);
}

// ==========================================
// KONAMI CODE EASTER EGG - Minecraft Style
// ==========================================
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateMinecraftMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateMinecraftMode() {
    // Spawn multiple Steves
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFloatingSteve();
        }, i * 200);
    }

    // Show achievement
    showAchievement('Geheimnis entdeckt!', 'Du hast den Konami Code gefunden!');
}

function createFloatingSteve() {
    const steve = document.createElement('div');
    steve.style.position = 'fixed';
    steve.style.width = '48px';
    steve.style.height = '48px';
    steve.style.left = Math.random() * window.innerWidth + 'px';
    steve.style.top = '-60px';
    steve.innerHTML = '<img src="icons/player.png" alt="Steve" style="width:100%;height:100%;image-rendering:pixelated;display:block;">';
    steve.style.zIndex = '9999';
    steve.style.pointerEvents = 'none';
    steve.style.transition = 'all 3s ease-out';

    document.body.appendChild(steve);

    setTimeout(() => {
        steve.style.top = window.innerHeight + 'px';
        steve.style.transform = 'rotate(360deg)';
    }, 10);

    setTimeout(() => steve.remove(), 3000);
}

function showAchievement(title, subtitle) {
    const achievement = document.createElement('div');
    achievement.style.position = 'fixed';
    achievement.style.top = '-100px';
    achievement.style.right = '20px';
    achievement.style.background = 'rgba(0, 0, 0, 0.9)';
    achievement.style.border = '3px solid #FFD700';
    achievement.style.padding = '20px';
    achievement.style.borderRadius = '8px';
    achievement.style.zIndex = '10000';
    achievement.style.minWidth = '300px';
    achievement.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.8)';
    achievement.style.transition = 'top 0.5s ease-out';

    achievement.innerHTML = `
        <div style="font-size: 16px; color: #FFD700; font-weight: bold; margin-bottom: 5px; text-shadow: 2px 2px 0 #000;">
            ${title}
        </div>
        <div style="font-size: 14px; color: #AAAAAA; text-shadow: 1px 1px 2px #000;">
            ${subtitle}
        </div>
    `;

    document.body.appendChild(achievement);

    setTimeout(() => {
        achievement.style.top = '20px';
    }, 10);

    setTimeout(() => {
        achievement.style.top = '-100px';
    }, 4000);

    setTimeout(() => {
        achievement.remove();
    }, 4500);
}

// ==========================================
// CONSOLE EASTER EGG - Minecraft Style
// ==========================================
console.log(
    '%c▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
    'font-family: monospace; font-size: 12px; color: #7CBD3B;'
);
console.log(
    '%c      CraftZ Minecraft Server',
    'font-family: monospace; font-size: 16px; font-weight: bold; color: #FFD700;'
);
console.log(
    '%c▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
    'font-family: monospace; font-size: 12px; color: #8B6F47;'
);
console.log(
    '%c\nSuchst du nach Geheimnissen?\nVersuch den Konami Code: ↑↑↓↓←→←→BA\n',
    'font-size: 13px; color: #55FFFF;'
);
console.log(
    '%cInteresse am Development?\nSchreib uns auf Discord: discord.gg/JNyefdvkBc',
    'font-size: 12px; color: #5865F2; font-weight: bold;'
);

// ==========================================
// PAGE LOAD ANIMATION
// ==========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 10);
});

console.log('%c✓ CraftZ Website geladen!', 'color: #50C878; font-weight: bold; font-size: 14px;');
