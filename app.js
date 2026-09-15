/**
 * O Homem que Decide - Interactive Engine
 * Handles hotspots, speech narration, progress tracking, checklist, and share interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar
  const progressBar = document.getElementById('reading-progress-bar');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  });

  // 2. Interactive Hotspots on Painting
  const hotspots = document.querySelectorAll('.hotspot');
  const hotspotCard = document.getElementById('hotspot-card');
  const hotspotTitle = document.getElementById('hotspot-title');
  const hotspotDesc = document.getElementById('hotspot-desc');

  hotspots.forEach(spot => {
    spot.addEventListener('click', () => {
      hotspots.forEach(s => s.classList.remove('active'));
      spot.classList.add('active');
      
      const title = spot.getAttribute('data-title');
      const desc = spot.getAttribute('data-desc');

      if (hotspotTitle && hotspotDesc) {
        hotspotTitle.textContent = title;
        hotspotDesc.textContent = desc;
        
        // Brief pulse highlight
        hotspotCard.style.transform = 'scale(1.02)';
        hotspotCard.style.borderColor = spot.classList.contains('warning') ? '#ef4444' : '#fbbf24';
        setTimeout(() => {
          hotspotCard.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });

  // 3. Font Resizing (A- / A+)
  let currentFontSize = 17; // base px
  const fontDec = document.getElementById('font-dec');
  const fontInc = document.getElementById('font-inc');

  if (fontDec && fontInc) {
    fontDec.addEventListener('click', () => {
      if (currentFontSize > 14) {
        currentFontSize -= 1;
        document.documentElement.style.setProperty('--base-font-size', `${currentFontSize}px`);
      }
    });

    fontInc.addEventListener('click', () => {
      if (currentFontSize < 23) {
        currentFontSize += 1;
        document.documentElement.style.setProperty('--base-font-size', `${currentFontSize}px`);
      }
    });
  }

  // 3.1 Theme Toggle (Dark / Light Mode)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('homem_theme', theme);
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-moon';
        themeToggleBtn.setAttribute('title', 'Mudar para Tema Escuro');
      } else {
        themeIcon.className = 'fa-solid fa-sun';
        themeToggleBtn.setAttribute('title', 'Mudar para Tema Claro');
      }
    }
  }

  const savedTheme = localStorage.getItem('homem_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(newTheme === 'light' ? 'Tema Claro ativado!' : 'Tema Escuro ativado!', newTheme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon');
    });
  }

  // 4. Toast Notification Helper
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer = null;

  function showToast(message, iconClass = 'fa-solid fa-check-circle') {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    const icon = document.getElementById('toast-icon');
    if (icon) icon.className = iconClass;
    
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

  // 5. Copy Quote & Bible Verses
  document.querySelectorAll('.btn-copy-quote, .btn-share-verse').forEach(btn => {
    btn.addEventListener('click', () => {
      const quote = btn.getAttribute('data-quote');
      const verse = btn.getAttribute('data-verse');
      let textToCopy = quote;
      
      if (!textToCopy && verse) {
        const card = btn.closest('.scripture-card');
        const bodyText = card ? card.querySelector('.scripture-body')?.textContent.trim() : '';
        textToCopy = `"${bodyText}" - ${verse}`;
      }

      if (textToCopy && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('Texto copiado para a área de transferência!');
        }).catch(() => {
          showToast('Copiado com sucesso!');
        });
      }
    });
  });

  // 6. WhatsApp Share Integration
  function shareViaWhatsApp() {
    const lines = [
      "🛡️ *O Homem que Decide: Vencendo a Passividade e o Piloto Automático*",
      "✍️ _por Roque Filho • Setembro/2026_",
      "",
      "\"Não decidir já é uma decisão. Quando nos omitimos diante de um assunto, a falta de escolha define o desfecho por nós.\"",
      "",
      "Reflexão imperdível para homens sobre a omissão de Isaque e o exemplo supremo de Jesus Cristo como líder e protetor da família.",
      "",
      "👉 Acesse a reflexão completa:"
    ];

    if (window.location.href && !window.location.href.startsWith('file:')) {
      lines.push(window.location.href);
    }

    const fullMessage = lines.join('\n');
    const shareUrl = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(fullMessage);
    window.open(shareUrl, '_blank');
  }

  const btnShareTop = document.getElementById('btn-share-top');
  const btnShareSidebar = document.getElementById('btn-share-sidebar');
  if (btnShareTop) btnShareTop.addEventListener('click', shareViaWhatsApp);
  if (btnShareSidebar) btnShareSidebar.addEventListener('click', shareViaWhatsApp);

  // 7. Fullscreen Modal for Artwork
  const btnFullscreen = document.getElementById('btn-fullscreen-img');
  const modal = document.getElementById('image-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');

  if (btnFullscreen && modal) {
    btnFullscreen.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });

    btnCloseModal.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  // 8. Decision Checklist Persistence
  const checkBoxes = document.querySelectorAll('.decision-checklist input[type="checkbox"]');
  const feedback = document.getElementById('checklist-feedback');

  function updateChecklistStatus() {
    let checkedCount = 0;
    checkBoxes.forEach((cb, idx) => {
      if (cb.checked) {
        checkedCount++;
        localStorage.setItem(`homem_decide_chk_${idx}`, 'true');
      } else {
        localStorage.removeItem(`homem_decide_chk_${idx}`);
      }
    });

    if (checkedCount === checkBoxes.length && feedback) {
      feedback.classList.remove('hidden');
    } else if (feedback) {
      feedback.classList.add('hidden');
    }
  }

  checkBoxes.forEach((cb, idx) => {
    if (localStorage.getItem(`homem_decide_chk_${idx}`) === 'true') {
      cb.checked = true;
    }
    cb.addEventListener('change', updateChecklistStatus);
  });
  updateChecklistStatus();

  // 9. Prayer / Amen Counter (Initialized from Zero)
  const btnAmen = document.getElementById('btn-amen');
  const amenCountEl = document.getElementById('amen-count');
  const amenDisplay = document.getElementById('amen-counter-display');
  
  // Clean any legacy count > 10 that might have been 47
  let storedCount = localStorage.getItem('homem_amen_count');
  if (storedCount === '47') {
    localStorage.removeItem('homem_amen_count');
    localStorage.removeItem('homem_agreed');
    storedCount = null;
  }

  let count = parseInt(storedCount || '0', 10);
  let hasAgreed = localStorage.getItem('homem_agreed') === 'true';

  function renderAmenCount(val) {
    if (!amenDisplay) return;
    if (val === 0) {
      amenDisplay.innerHTML = '<i class="fa-solid fa-users"></i> <strong id="amen-count">0</strong> homens confirmaram ainda. Seja o primeiro!';
    } else if (val === 1) {
      amenDisplay.innerHTML = '<i class="fa-solid fa-users"></i> <strong id="amen-count">1</strong> homem já confirmou esta decisão hoje';
    } else {
      amenDisplay.innerHTML = `<i class="fa-solid fa-users"></i> <strong id="amen-count">${val}</strong> homens já confirmaram esta decisão hoje`;
    }
  }

  renderAmenCount(count);

  if (hasAgreed && btnAmen) {
    btnAmen.classList.add('clicked');
    btnAmen.innerHTML = '<i class="fa-solid fa-check-double"></i> Decisão Gravada em Oração';
  }

  if (btnAmen) {
    btnAmen.addEventListener('click', () => {
      if (!hasAgreed) {
        hasAgreed = true;
        count += 1;
        localStorage.setItem('homem_amen_count', count.toString());
        localStorage.setItem('homem_agreed', 'true');
        renderAmenCount(count);
        btnAmen.classList.add('clicked');
        btnAmen.innerHTML = '<i class="fa-solid fa-check-double"></i> Decisão Gravada em Oração';
        showToast('Amém! Sua decisão foi confirmada diante de Deus.', 'fa-solid fa-hands-praying');
      } else {
        showToast('Você já confirmou seu alinhamento hoje!', 'fa-solid fa-circle-info');
      }
    });
  }

  // 10. Native Audio Playback Engine (audio.ogg)
  const audio = document.getElementById('main-audio');
  const heroAudioPlayer = document.getElementById('hero-audio-player');
  const mainPlayBtn = document.getElementById('audio-main-play-btn');
  const mainPlayIcon = document.getElementById('main-play-icon');
  const btnAudioReadTop = document.getElementById('btn-audio-read');
  const seekBar = document.getElementById('audio-seek-bar');
  const currentTimeEl = document.getElementById('audio-current-time');
  const durationTimeEl = document.getElementById('audio-duration-time');
  
  // Floating Top Player
  const floatingPanel = document.getElementById('audio-player-panel');
  const miniPlayBtn = document.getElementById('audio-mini-play');
  const miniTimeLabel = document.getElementById('audio-mini-time');
  const miniSpeedBtn = document.getElementById('audio-mini-speed');

  // Extra Controls
  const speedButtons = document.querySelectorAll('.speed-btn');
  const volumeBar = document.getElementById('audio-volume-bar');
  const volumeMuteBtn = document.getElementById('btn-volume-mute');
  const volumeIcon = document.getElementById('volume-icon');

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function toggleAudioPlayback() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => {
        updatePlayState(true);
      }).catch(err => {
        console.warn('Playback error:', err);
        showToast('Clique para iniciar a reprodução do áudio.', 'fa-solid fa-circle-play');
      });
    } else {
      audio.pause();
      updatePlayState(false);
    }
  }

  function updatePlayState(isPlaying) {
    if (isPlaying) {
      if (mainPlayIcon) mainPlayIcon.className = 'fa-solid fa-pause';
      if (miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      if (heroAudioPlayer) heroAudioPlayer.classList.add('playing');
      if (btnAudioReadTop) {
        btnAudioReadTop.innerHTML = '<i class="fa-solid fa-pause"></i> <span class="btn-text">Pausar Áudio</span>';
      }
      checkFloatingPanelVisibility();
    } else {
      if (mainPlayIcon) mainPlayIcon.className = 'fa-solid fa-play';
      if (miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      if (heroAudioPlayer) heroAudioPlayer.classList.remove('playing');
      if (btnAudioReadTop) {
        btnAudioReadTop.innerHTML = '<i class="fa-solid fa-headphones"></i> <span class="btn-text">Ouvir Reflexão</span>';
      }
    }
  }

  function checkFloatingPanelVisibility() {
    if (!audio || !floatingPanel || !heroAudioPlayer) return;
    const heroRect = heroAudioPlayer.getBoundingClientRect();
    if (!audio.paused && heroRect.bottom < 60) {
      floatingPanel.classList.remove('hidden');
    } else if (audio.paused && heroRect.bottom >= 60) {
      floatingPanel.classList.add('hidden');
    }
  }

  if (audio) {
    // Loaded metadata
    audio.addEventListener('loadedmetadata', () => {
      if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
      if (seekBar) seekBar.max = audio.duration;
    });

    // Time update
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const current = audio.currentTime;
      const total = audio.duration;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
      if (miniTimeLabel) miniTimeLabel.textContent = `${formatTime(current)} / ${formatTime(total)}`;
      if (seekBar) {
        seekBar.value = current;
        const progress = (current / total) * 100;
        seekBar.style.background = `linear-gradient(to right, #fbbf24 ${progress}%, rgba(255,255,255,0.15) ${progress}%)`;
      }
    });

    // Seeking
    if (seekBar) {
      seekBar.addEventListener('input', () => {
        audio.currentTime = seekBar.value;
      });
    }

    // Playback Ended
    audio.addEventListener('ended', () => {
      updatePlayState(false);
      if (seekBar) seekBar.value = 0;
      if (floatingPanel) floatingPanel.classList.add('hidden');
      showToast('Áudio concluído! Que esta mensagem frutifique em seu lar.', 'fa-solid fa-circle-check');
    });

    // Buttons
    if (mainPlayBtn) mainPlayBtn.addEventListener('click', toggleAudioPlayback);
    if (miniPlayBtn) miniPlayBtn.addEventListener('click', toggleAudioPlayback);
    if (btnAudioReadTop) btnAudioReadTop.addEventListener('click', toggleAudioPlayback);

    // Speed controls
    const speeds = [1, 1.25, 1.5, 2];
    let currentSpeedIndex = 0;

    function setPlaybackSpeed(rate) {
      audio.playbackRate = rate;
      speedButtons.forEach(btn => {
        if (parseFloat(btn.getAttribute('data-speed')) === rate) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      if (miniSpeedBtn) miniSpeedBtn.textContent = `${rate}x`;
      showToast(`Velocidade do áudio: ${rate}x`, 'fa-solid fa-forward');
    }

    speedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const rate = parseFloat(btn.getAttribute('data-speed'));
        setPlaybackSpeed(rate);
      });
    });

    if (miniSpeedBtn) {
      miniSpeedBtn.addEventListener('click', () => {
        currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
        setPlaybackSpeed(speeds[currentSpeedIndex]);
      });
    }

    // Volume controls
    if (volumeBar) {
      volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value;
        if (audio.volume === 0) {
          if (volumeIcon) volumeIcon.className = 'fa-solid fa-volume-xmark';
        } else if (audio.volume < 0.5) {
          if (volumeIcon) volumeIcon.className = 'fa-solid fa-volume-low';
        } else {
          if (volumeIcon) volumeIcon.className = 'fa-solid fa-volume-high';
        }
      });
    }

    if (volumeMuteBtn) {
      volumeMuteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        if (audio.muted) {
          if (volumeIcon) volumeIcon.className = 'fa-solid fa-volume-xmark';
          if (volumeBar) volumeBar.value = 0;
        } else {
          if (volumeIcon) volumeIcon.className = 'fa-solid fa-volume-high';
          if (volumeBar) volumeBar.value = audio.volume || 1;
        }
      });
    }

    window.addEventListener('scroll', checkFloatingPanelVisibility);
  }
});

