<template>

  <v-dialog
      v-model="showInstallButton"
      max-width="960"
      transition="dialog-top-transition"
  >
    <v-card variant="flat" rounded>
      <v-card-item>
        <strong class="font-15">
          برای دسترسی آسان تر برنامه لیدانا را در دستگاه خود نصب کنید
        </strong>
      </v-card-item>
      <v-divider/>
      <v-card-item>
        <v-btn  color="success" class="ml-2" append-icon="mdi-check" text="نصب برنامه" flat  rounded @click="installApp"></v-btn>
        <v-btn  color="blue-grey-darken-4" append-icon="mdi-close" text="بستن" flat  rounded @click="dismissPrompt"></v-btn>

      </v-card-item>
    </v-card>
  </v-dialog>



</template>

<script>
export default {
  name: 'InstallPrompt',
  data() {
    return {
      deferredPrompt: null,
      showInstallButton: false,
      isIos: false
    }
  },
  mounted() {
    // اگر کاربر قبلاً پیام را رد کرده باشد نمایش نده
    if (this.shouldShowPrompt()) {
      window.addEventListener('beforeinstallprompt', this.handleInstallPrompt)
      this.detectIos()
    }
  },
  methods: {
    shouldShowPrompt() {
      return localStorage.getItem('installPrompt') !== 'dismissed'
    },

    handleInstallPrompt(e) {
      e.preventDefault()
      this.deferredPrompt = e
      this.showInstallButton = true
    },

    detectIos() {
      this.isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
      const isInStandaloneMode = 'standalone' in navigator && navigator.standalone

      if (this.isIos && !isInStandaloneMode && this.shouldShowPrompt()) {
        this.showInstallButton = true
      }
    },

    async installApp() {
      if (this.deferredPrompt) {
        try {
          this.deferredPrompt.prompt()
          const { outcome } = await this.deferredPrompt.userChoice
          if (outcome === 'accepted') {
            localStorage.setItem('installPrompt', 'installed')
          }
        } finally {
          this.resetPrompt()
        }
      } else if (this.isIos) {
        alert('برای نصب: 1. دکمه اشتراک‌گذاری (سهم) را بزنید 2. گزینه "Add to Home Screen" را انتخاب کنید')
        this.resetPrompt()
      }
    },

    dismissPrompt() {
      this.resetPrompt()
      localStorage.setItem('installPrompt', 'dismissed')
    },

    resetPrompt() {
      this.showInstallButton = false
      this.deferredPrompt = null
      window.removeEventListener('beforeinstallprompt', this.handleInstallPrompt)
    }
  },
  created() {
    // بررسی اولیه وضعیت localStorage
    if (!this.shouldShowPrompt()) {
      this.showInstallButton = false
    }
  }
}
</script>