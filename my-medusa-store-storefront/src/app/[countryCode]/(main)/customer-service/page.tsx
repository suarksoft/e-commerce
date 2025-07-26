"use client";   

import type React from "react";

import { useState } from "react";
import { MessageCircle, Phone, Mail, Send, X, ChevronDown, ChevronUp, HelpCircle, User, Clock, MapPin, Star, Shield, Truck, CreditCard, RefreshCw } from "lucide-react";
import { Button } from "@medusajs/ui";
import { Input } from "@medusajs/ui";
import { Textarea } from "@medusajs/ui";

const faqData = [
  {
    question: "Siparişimi nasıl takip edebilirim?",
    answer:
      "Siparişinizi takip etmek için hesabınıza giriş yapın ve 'Siparişlerim' bölümünden takip numaranızı kullanarak durumunu kontrol edebilirsiniz. Ayrıca SMS ve e-posta ile de bilgilendirme alacaksınız.",
    icon: <Truck className="h-5 w-5 text-blue-500" />
  },
  {
    question: "İade ve değişim koşulları nelerdir?",
    answer:
      "Ürünlerinizi 14 gün içinde hiçbir neden belirtmeden iade edebilirsiniz. Ürünlerin orijinal ambalajında ve kullanılmamış olması gerekmektedir. İade kargo ücreti firmamız tarafından karşılanmaktadır.",
    icon: <RefreshCw className="h-5 w-5 text-green-500" />
  },
  {
    question: "Kargo ücreti ne kadar?",
    answer:
      "150 TL ve üzeri alışverişlerde kargo ücretsizdir. 150 TL altındaki siparişlerde kargo ücreti 29.90 TL'dir. Aynı gün kargo seçeneği için ek ücret alınmaktadır.",
    icon: <Truck className="h-5 w-5 text-purple-500" />
  },
  {
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kabul ediyoruz. Tüm ödemeler SSL ile güvence altındadır. Taksitli ödeme seçenekleri de mevcuttur.",
    icon: <CreditCard className="h-5 w-5 text-orange-500" />
  },
  {
    question: "Güvenli alışveriş nasıl sağlanıyor?",
    answer:
      "Tüm ödemelerimiz SSL sertifikası ile korunmaktadır. Kişisel bilgileriniz şifrelenerek saklanır ve üçüncü taraflarla paylaşılmaz. 256-bit güvenlik protokolü kullanılmaktadır.",
    icon: <Shield className="h-5 w-5 text-red-500" />
  }
]

const CustomerService = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Merhaba! Size nasıl yardımcı olabilirim?", isUser: false, time: "14:30" }
  ])
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        text: chatMessage,
        isUser: true,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")
      
      // Simüle edilmiş bot yanıtı
      setTimeout(() => {
        const botResponse = {
          id: chatMessages.length + 2,
          text: "Mesajınız alındı. En kısa sürede size dönüş yapacağız. Teşekkürler!",
          isUser: false,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }
        setChatMessages(prev => [...prev, botResponse])
      }, 1000)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simüle edilmiş form gönderimi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log("İletişim formu:", contactForm)
    setContactForm({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
    
    // Başarı mesajı göster
    alert("Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full mb-6 shadow-lg">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
            Müşteri Hizmetleri
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Size en iyi hizmeti sunmak için buradayız! Sorularınız için bizimle iletişime geçin.
          </p>
        </div>

        

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="hover:shadow-2xl transition-all duration-500 border border-pink-100 hover:border-pink-300 transform hover:scale-105 bg-gradient-to-br from-white to-pink-50 rounded-2xl">
            <div className="p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-pink-600 mx-auto mb-6 shadow-lg">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Telefon Desteği</h3>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Pazartesi - Cuma: 09:00 - 18:00
                </p>
                <p className="text-sm text-gray-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Cumartesi: 10:00 - 16:00
                </p>
              </div>
              <p className="text-2xl font-bold text-pink-600 mb-4">0850 123 45 67</p>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Hemen Ara
              </Button>
            </div>
          </div>

          <div className="hover:shadow-2xl transition-all duration-500 border border-orange-100 hover:border-orange-300 transform hover:scale-105 bg-gradient-to-br from-white to-orange-50 rounded-2xl">
            <div className="p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Canlı Destek</h3>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  7/24 Online Destek
                </p>
                <p className="text-sm text-gray-600 flex items-center justify-center">
                  <Star className="h-4 w-4 mr-2" />
                  Anında Yanıt
                </p>
              </div>
              <p className="text-2xl font-bold text-orange-600 mb-4">Chat Başlat</p>
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsChatOpen(true)}
              >
                Şimdi Başla
              </Button>
            </div>
          </div>

          <div className="hover:shadow-2xl transition-all duration-500 border border-purple-100 hover:border-purple-300 transform hover:scale-105 bg-gradient-to-br from-white to-purple-50 rounded-2xl">
            <div className="p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600 mx-auto mb-6 shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">E-posta Desteği</h3>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  24 saat içinde yanıt
                </p>
                <p className="text-sm text-gray-600 flex items-center justify-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Güvenli İletişim
                </p>
              </div>
              <p className="text-lg font-bold text-purple-600 mb-4">destek@modaeses.com</p>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                E-posta Gönder
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl">
          <div className="text-center pb-8 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Sık Sorulan Sorular</h2>
            <p className="text-gray-600 mt-2">En çok sorulan soruların cevaplarını burada bulabilirsiniz</p>
          </div>
          <div className="px-8 pb-8">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 transition-all duration-300"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <div className="flex items-center space-x-4">
                      {faq.icon}
                      <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                    </div>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-6 w-6 text-pink-600 transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-pink-600 transition-transform duration-300" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 text-gray-600 border-t border-gray-100 bg-gray-50">
                      <p className="pt-4 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="shadow-xl border-0 bg-gradient-to-br from-white to-pink-50 rounded-2xl">
          <div className="text-center pb-8 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4 shadow-lg">
              <Send className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Bize Yazın</h2>
            <p className="text-gray-600 mt-2">Sorularınızı ve önerilerinizi bizimle paylaşın</p>
          </div>
          <div className="px-8 pb-8">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Ad Soyad</label>
                  <Input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Adınızı ve soyadınızı girin"
                    className="focus:border-pink-300 focus:ring-pink-200 h-12 text-lg rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">E-posta</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="E-posta adresinizi girin"
                    className="focus:border-pink-300 focus:ring-pink-200 h-12 text-lg rounded-xl"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Konu</label>
                <Input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Mesajınızın konusunu girin"
                  className="focus:border-pink-300 focus:ring-pink-200 h-12 text-lg rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Mesaj</label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Mesajınızı buraya yazın..."
                  rows={6}
                  className="focus:border-pink-300 focus:ring-pink-200 text-lg rounded-xl resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Gönderiliyor...
                  </div>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-3" />
                    Mesaj Gönder
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Chat Widget */}
        {isChatOpen && (
          <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Canlı Destek</h3>
                  <p className="text-sm opacity-90 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </p>
                </div>
              </div>
              <Button
                variant="transparent"
                size="small"
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isUser 
                        ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white' 
                        : 'bg-white text-gray-800 shadow-md'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isUser ? 'text-pink-100' : 'text-gray-500'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="p-6 border-t border-gray-200 bg-white">
              <div className="flex space-x-3">
                <Input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 focus:border-pink-300 focus:ring-pink-200 rounded-xl"
                />
                <Button
                  type="submit"
                  size="small"
                  className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white rounded-xl px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Chat Button (when chat is closed) */}
        {!isChatOpen && (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 transform hover:scale-110"
          >
            <MessageCircle className="h-7 w-7" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default CustomerService
