const __BMKHandler = {
    // --- Global State ---
    ytChapterData: null,
    isShorts: false,
    __mediaMetadataTitle: '',
    __actionHandlerPrevious: null,
    __lastClickNext: 0,
    __lastClickPrevious: 0,

    DEFAULT_CONFIG: {
        LoopVideos: false,
        minLoopVideoDuration: 3600,
        swapTitle: true,
        minSwapTitleVideoDuration: 3600,
        previousTrackCmd: 'RESTART_VIDEO',
        nextTrackCmd: 'NEXT_VIDEO',
        IgnoreChapters: false,
        IgnoreShorts: false,
        IgnorePlaylists: false,
    },

    __config: {},
    originalSetActionHandler: navigator.mediaSession.setActionHandler,

    // --- Helpers ---
    getMoviePlayer: () => document.getElementById('movie_player'),
    getShortsPlayer: () => document.getElementById('shorts-player'),
    getChapterTitleElement: () => document.getElementsByClassName('ytp-chapter-title-content')[0],

    updateMediaMetadataTitle(title) {
        delete navigator.mediaSession.metadata;
        const newMetadata = new MediaMetadata(navigator.mediaSession.metadata);
        newMetadata.title = title;
        navigator.mediaSession.metadata = newMetadata;
        
        Object.defineProperty(navigator.mediaSession, "metadata", {
            configurable: true,
            set: (metadata) => this.setMetaDataTitleHandler(metadata)
        });
    },

    /**
     * Extracts chapter data from complex YouTube response objects
     */
    extractChapters(source) {
        const markers = source?.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer
                       ?.decoratedPlayerBarRenderer?.playerBar?.multiMarkersPlayerBarRenderer?.markersMap;

        if (Array.isArray(markers)) {
            for (const element of markers) {
                if (element.key === 'AUTO_CHAPTERS' || element.key === 'DESCRIPTION_CHAPTERS') {
                    return element.value;
                }
            }
        }
        return null;
    },

    // --- Core Logic Functions ---

    setMetaDataTitleHandler(metadata) {
        const player = this.getMoviePlayer();
        const chapterElement = this.getChapterTitleElement();

        if (this.__config.swapTitle && player?.getDuration) {
            const duration = player.getDuration();
            const meetsThreshold = duration >= this.__config.minSwapTitleVideoDuration || this.__config.minSwapTitleVideoDuration === 3600;

            if (meetsThreshold && chapterElement?.textContent && metadata?.title) {
                metadata.title = chapterElement.textContent;
            } else if (!meetsThreshold && this.__mediaMetadataTitle !== '') {
                metadata.title = this.__mediaMetadataTitle;
            }
        }

        delete navigator.mediaSession.metadata;
        navigator.mediaSession.metadata = new MediaMetadata(metadata);
        Object.defineProperty(navigator.mediaSession, "metadata", {
            configurable: true,
            set: (m) => this.setMetaDataTitleHandler(m)
        });
    },

    syncChapterTitle() {
        const chapterElement = this.getChapterTitleElement();
        const player = this.getMoviePlayer();

        if (chapterElement?.textContent && 'mediaSession' in navigator) {
            if (this.__config.swapTitle && player?.getDuration) {
                const duration = player.getDuration();
                if (duration >= this.__config.minSwapTitleVideoDuration || this.__config.minSwapTitleVideoDuration === 3600) {
                    this.updateMediaMetadataTitle(chapterElement.textContent);
                }
            }
        }
    },

    handleNextTrackCommand(player) {
        if (!player) return;
        
        switch (this.__config.nextTrackCmd) {
            case 'GO_FORWARD_10_SECONDS_VIDEO_ANIMATED':
                player.handleGlobalKeyDown?.(76, false, false); // 'L'
                break;
            case 'GO_FORWARD_5_SECONDS_VIDEO':
                player.seekBy?.(5);
                break;
            case 'GO_FORWARD_10_SECONDS_VIDEO':
                player.seekBy?.(10);
                break;
            case 'NOTHING':
                break;
            case 'NEXT_VIDEO':
                player.nextVideo?.();
                break;
            case 'GO_FORWARD_5_SECONDS_VIDEO_ANIMATED':
            default:
                player.handleGlobalKeyDown?.(39, false, false); // Right Arrow
                break;
        }
    },

    handlePreviousTrackCommand(player) {
        if (!player) return;

        switch (this.__config.previousTrackCmd) {
            case 'RESTART_VIDEO_ANIMATED':
                player.seekTo?.(0);
                player.wakeUpControls?.();
                break;
            case 'GO_BACK_5_SECONDS_VIDEO_ANIMATED':
                player.handleGlobalKeyDown?.(37, false, false); // Left Arrow
                break;
            case 'GO_BACK_10_SECONDS_VIDEO_ANIMATED':
                player.handleGlobalKeyDown?.(74, false, false); // 'J'
                break;
            case 'GO_BACK_5_SECONDS_VIDEO':
                player.seekBy?.(-5);
                break;
            case 'GO_BACK_10_SECONDS_VIDEO':
                player.seekBy?.(-10);
                break;
            case 'NOTHING':
                break;
            case 'PREVIOUS_PAGE':
                history.back();
                break;
            case 'RESTART_VIDEO':
            default:
                player.seekTo?.(0);
                break;
        }
    },

    // --- Event Handlers ---

    onConfigUpdate(event) {
        const config = event.detail;
        if (!config) return;

        const urlParams = new URLSearchParams(window.location.search);
        const player = this.getMoviePlayer();

        // Handle Looping
        if (player?.setLoopVideo && !this.isShorts && !urlParams.has('list')) {
            const duration = player.getDuration?.() || 0;
            if (config.LoopVideos && (duration <= config.minLoopVideoDuration || config.minLoopVideoDuration === 3600)) {
                player.setLoopVideo(true);
            } else {
                player.setLoopVideo(false);
            }
        }

        // Handle Title Swap
        if (config.swapTitle && player?.getDuration) {
            const duration = player.getDuration();
            const chapterElement = this.getChapterTitleElement();
            if (duration >= config.minSwapTitleVideoDuration || config.minSwapTitleVideoDuration === 3600) {
                if (chapterElement) this.updateMediaMetadataTitle(chapterElement.textContent);
            }
        } else if (this.__mediaMetadataTitle !== '') {
            this.updateMediaMetadataTitle(this.__mediaMetadataTitle);
        }

        localStorage.setItem('BetterMediakeysSettings', JSON.stringify(config));
        this.__config = config;
    },

    onPlayerNavigate(event) {
        if (!('mediaSession' in navigator)) return;

        const player = this.getMoviePlayer();
        const urlParams = new URLSearchParams(window.location.search);

        switch (event.type) {
            case 'yt-shorts-reset':
                this.isShorts = true;
                break;

            case 'yt-player-updated':
                if (this.__config.swapTitle && player?.getDuration) {
                    if (player.getDuration() >= this.__config.minSwapTitleVideoDuration || this.__config.minSwapTitleVideoDuration === 3600) {
                        this.setMetaDataTitleHandler(navigator.mediaSession.metadata);
                    }
                }
                break;

            case 'yt-navigate-finish':
                // Update Shorts status
                this.isShorts = event.detail?.pageType === 'shorts';

                // Loop logic
                if (player?.setLoopVideo && !this.isShorts && !urlParams.has('list')) {
                    const duration = player.getDuration?.() || 0;
                    player.setLoopVideo(this.__config.LoopVideos && (duration <= this.__config.minLoopVideoDuration || this.__config.minLoopVideoDuration === 3600));
                }

                // Extract Chapters
                if (!this.__config.IgnoreChapters) {
                    const chapters = this.extractChapters(event.detail?.response?.response);
                    if (chapters) this.ytChapterData = chapters;
                }

                // Media Title logic
                const videoDetails = event.detail?.response?.playerResponse?.videoDetails;
                if (videoDetails?.title) {
                    this.__mediaMetadataTitle = videoDetails.title;
                }

                delete navigator.mediaSession.metadata;
                Object.defineProperty(navigator.mediaSession, "metadata", {
                    configurable: true,
                    set: (metadata) => this.setMetaDataTitleHandler(metadata)
                });
                break;

            case 'DOMContentLoaded':
                if (this.ytChapterData === null && typeof ytInitialData !== 'undefined') {
                    const chapters = this.extractChapters(ytInitialData);
                    if (chapters) this.ytChapterData = chapters;
                }
                break;
        }

        // Set up MutationObserver for chapter changes
        const chapterElement = this.getChapterTitleElement();
        if (chapterElement) {
            this.syncChapterTitle();
            new MutationObserver(() => this.syncChapterTitle()).observe(chapterElement, { childList: true, subtree: true });
        }
    },

    init() {
        // Initialize Config
        this.__config = { ...this.DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem('BetterMediakeysSettings') || '{}') };

        // Intercept MediaSession Action Handlers
        const self = this;
        navigator.mediaSession.setActionHandler = function(action, handler) {
            const urlParams = new URLSearchParams(window.location.search);

            if (handler === null) {
                if (action === 'nexttrack') {
                    self.originalSetActionHandler.call(this, 'nexttrack', () => {
                        const player = self.getMoviePlayer();
                        const chapterElement = self.getChapterTitleElement();

                        if (player?.getWatchNextResponse && self.ytChapterData === null) {
                            self.ytChapterData = self.extractChapters(player.getWatchNextResponse());
                        }

                        if (!self.isShorts && player?.seekToChapterWithAnimation && chapterElement?.textContent) {
                            const idx = self.ytChapterData?.chapters?.findIndex(c => c.chapterRenderer.title.simpleText === chapterElement.textContent);
                            if (idx !== -1 && (idx + 1) < self.ytChapterData.chapters.length) {
                                player.seekToChapterWithAnimation(idx + 1);
                                self.updateMediaMetadataTitle(self.ytChapterData.chapters[idx + 1].chapterRenderer.title.simpleText);
                            }
                        } 
                        else if (!self.isShorts && player?.seekTo && chapterElement?.textContent) {
                            let idx = self.ytChapterData?.chapters?.findIndex(c => c.chapterRenderer.title.simpleText === chapterElement.textContent);
                            if (idx === -1) idx = self.ytChapterData?.chapters?.findIndex(c => c.chapterRenderer.title.runs?.at(0)?.text === chapterElement.textContent);
                            
                            if (idx !== -1 && (idx + 1) < self.ytChapterData.chapters.length) {
                                player.seekTo(self.ytChapterData.chapters[idx + 1].chapterRenderer.timeRangeStartMillis / 1000);
                                player.wakeUpControls?.();
                                self.updateMediaMetadataTitle(self.ytChapterData.chapters[idx + 1].chapterRenderer.title.simpleText);
                            }
                        } 
                        else if (self.isShorts) {
                            const nextBtn = document.getElementById('navigation-button-down')?.firstElementChild?.firstElementChild?.firstElementChild;
                            if (nextBtn?.click && Date.now() > self.__lastClickNext) {
                                nextBtn.click();
                                self.__lastClickNext = Date.now() + 1000;
                            }
                        } 
                        else {
                            self.handleNextTrackCommand(player);
                        }
                    });
                    return;
                }

                if (action === 'previoustrack') {
                    self.originalSetActionHandler.call(this, 'previoustrack', () => {
                        const player = self.getMoviePlayer();
                        const chapterElement = self.getChapterTitleElement();

                        if (player?.getWatchNextResponse && self.ytChapterData === null) {
                            self.ytChapterData = self.extractChapters(player.getWatchNextResponse());
                        }

                        if (!self.isShorts && player?.seekToChapterWithAnimation && chapterElement?.textContent) {
                            const idx = self.ytChapterData?.chapters?.findIndex(c => c.chapterRenderer.title.simpleText === chapterElement.textContent);
                            if (idx !== -1) {
                                const startTime = (self.ytChapterData.chapters[idx].chapterRenderer.timeRangeStartMillis + 5000) / 1000;
                                if (startTime <= player.getCurrentTime()) {
                                    player.seekToChapterWithAnimation(idx);
                                } else if (idx > 0) {
                                    player.seekToChapterWithAnimation(idx - 1);
                                    self.updateMediaMetadataTitle(self.ytChapterData.chapters[idx - 1].chapterRenderer.title.simpleText);
                                } else {
                                    player.seekTo(0);
                                }
                            }
                        } 
                        else if (!self.isShorts && player?.seekTo && chapterElement?.textContent) {
                            const idx = self.ytChapterData?.chapters?.findIndex(c => c.chapterRenderer.title.runs?.at(0)?.text === chapterElement.textContent);
                            if (idx !== -1) {
                                const startTime = (self.ytChapterData.chapters[idx].chapterRenderer.timeRangeStartMillis + 3000) / 1000;
                                if (startTime <= player.getCurrentTime()) {
                                    player.seekTo(self.ytChapterData.chapters[idx].chapterRenderer.timeRangeStartMillis / 1000);
                                    player.wakeUpControls?.();
                                } else if (idx > 0) {
                                    player.seekTo(self.ytChapterData.chapters[idx - 1].chapterRenderer.timeRangeStartMillis / 1000);
                                    player.wakeUpControls?.();
                                } else {
                                    player.seekTo(0);
                                    player.wakeUpControls?.();
                                }
                            }
                        } 
                        else if (self.isShorts) {
                            const prevBtn = document.getElementById('navigation-button-up')?.firstElementChild?.firstElementChild?.firstElementChild;
                            const shortsPlayer = self.getShortsPlayer();
                            if (prevBtn?.ariaDisabled === 'true' && shortsPlayer?.getCurrentTime() > 3) {
                                shortsPlayer.seekTo(0);
                            } else if (prevBtn?.click && Date.now() > self.__lastClickPrevious) {
                                prevBtn.click();
                                self.__lastClickPrevious = Date.now() + 1000;
                            }
                        } 
                        else if (player?.getCurrentTime() > 3) {
                            self.handlePreviousTrackCommand(player);
                        }
                    });
                    return;
                }
            } 
            else if (urlParams.has('list') && action === 'previoustrack' && !self.isShorts) {
                self.__actionHandlerPrevious = handler;
                self.originalSetActionHandler.call(this, 'previoustrack', () => {
                    const player = self.getMoviePlayer();
                    self.__actionHandlerPrevious.call(this, 'previoustrack', {});
                    if (player?.getCurrentTime() > 3) {
                        player.seekTo(0);
                    }
                });
                return;
            }

            self.originalSetActionHandler.call(this, action, handler);
        };

        // Initialize Metadata Setter
        Object.defineProperty(navigator.mediaSession, "metadata", {
            configurable: true,
            set: (metadata) => this.setMetaDataTitleHandler(metadata)
        });

        // Event Listeners
        document.addEventListener('bettermediakeys-config', (e) => this.onConfigUpdate(e), false);
        document.addEventListener('yt-navigate-finish', (e) => this.onPlayerNavigate(e), true);
        document.addEventListener('yt-shorts-reset', (e) => this.onPlayerNavigate(e), true);
        document.addEventListener('yt-player-updated', (e) => this.onPlayerNavigate(e), true);
        document.addEventListener('DOMContentLoaded', (e) => this.onPlayerNavigate(e), true);
    }
};

// Start the handler
__BMKHandler.init();