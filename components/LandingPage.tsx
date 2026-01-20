"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, ArrowRight, Heart, Headphones, Users } from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('monthly')
  const [amount, setAmount] = useState('50')
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const predefinedAmounts = ['10', '25', '50', '100']

  return (
    <div className="min-h-screen bg-[#f5f3e8]">
      {/* Navigation */}
      <nav className="bg-[#ebe9dc] border-b border-[#d4d2c5]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">HR</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm">HOPE RISE</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-800">
              <a href="#who-we-are" className="hover:text-gray-600 transition">WHO WE ARE</a>
              <a href="#what-we-do" className="hover:text-gray-600 transition">WHAT WE DO</a>
              <a href="#news-events" className="hover:text-gray-600 transition">NEWS & EVENTS</a>
              <a href="#get-involved" className="hover:text-gray-600 transition">GET INVOLVED</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#d4d2c5] rounded-full transition">
                <Phone className="w-4 h-4 text-gray-800" />
              </button>
              <Button className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 text-xs font-semibold rounded-sm">
                DONATE
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#ebe9dc] py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Hope Rise<br />is Support
            </h1>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-sm font-semibold rounded-full">
                DONATE
              </Button>
              <button className="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition font-semibold text-sm">
                I NEED HELP
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Ticker */}
      <div className="bg-[#e8e6d8] border-y border-[#d4d2c5] py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>QUICK DONATE</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <span className="text-gray-800">gofundme</span>
              <span className="text-gray-800">FAMILY ALLIANCE</span>
              <span className="text-gray-800">Medtronic</span>
            </div>

            <div className="flex items-center gap-2">
              <span>SCROLL DOWN</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-gray-600 mb-3 tracking-wider">WHAT WE DO</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Providing Hope And Help<br />During Challenging Times
            </h2>
            <Button variant="outline" className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-6 py-2 text-xs font-semibold rounded-full">
              LEARN MORE
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Cards Section */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16">
            {/* Make a Donation Card */}
            <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Make a Donation</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Contribute today to help fund treatments, research, and vital support services for those battling cancer.
                </p>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <span className="text-xs text-gray-600 ml-2">Payment Options</span>
                </div>

                <Button variant="ghost" className="w-full justify-between text-gray-800 hover:bg-gray-50 p-0 h-auto font-semibold text-sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Get Support Card */}
            <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get Support</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Access vital resources, financial aid, and counseling for cancer patients and their families in their time of need.
                </p>
                
                <div className="flex items-center gap-3 mb-4 text-xs font-semibold text-gray-700">
                  <span># Financial Aid</span>
                  <span># Therapy</span>
                </div>

                <Button variant="ghost" className="w-full justify-between text-gray-800 hover:bg-gray-50 p-0 h-auto font-semibold text-sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Become a Volunteer Card */}
            <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Become a Volunteer</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Join our team of volunteers to support cancer patients, assist with community outreach, and make a positive impact.
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white"></div>
                  </div>
                  <span className="text-xs text-gray-600 ml-2">Join Our Team</span>
                </div>

                <Button variant="ghost" className="w-full justify-between text-gray-800 hover:bg-gray-50 p-0 h-auto font-semibold text-sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="py-20 bg-[#f5f3e8]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-gray-600 mb-3 tracking-wider">OUR IMPACT</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Together, we're making a difference
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {/* People Helped */}
            <div className="text-center">
              <div className="mb-3">
                <span className="text-5xl md:text-6xl font-bold text-emerald-500">10K+</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">People Received Help</p>
            </div>

            {/* Funds Raised */}
            <div className="text-center">
              <div className="mb-3">
                <span className="text-5xl md:text-6xl font-bold text-emerald-500">$2.5M</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">Funds Raised</p>
            </div>

            {/* Volunteers */}
            <div className="text-center">
              <div className="mb-3">
                <span className="text-5xl md:text-6xl font-bold text-emerald-500">500+</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">Active Volunteers</p>
            </div>

            {/* Communities Served */}
            <div className="text-center">
              <div className="mb-3">
                <span className="text-5xl md:text-6xl font-bold text-emerald-500">85+</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">Communities Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-20 bg-[#ccc5b0]">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <CardContent className="p-8 md:p-12">
                {/* Choose Amount Header */}
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Choose amount</h3>
                
                {/* Donation Type Toggle */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <button
                    onClick={() => setDonationType('one-time')}
                    className={`text-sm font-medium transition ${
                      donationType === 'one-time' ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    One-Time Donation
                  </button>
                  
                  <div className="relative">
                    <div className={`w-12 h-6 rounded-full transition ${
                      donationType === 'monthly' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        donationType === 'monthly' ? 'left-7' : 'left-1'
                      }`}></div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setDonationType('monthly')}
                    className={`text-sm font-medium transition flex items-center gap-1 ${
                      donationType === 'monthly' ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    Monthly Support
                    {donationType === 'monthly' && <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" />}
                  </button>
                </div>

                {/* Custom Amount Input */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={customAmount || amount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setAmount(e.target.value)
                      }}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-lg font-semibold text-gray-900 focus:outline-none focus:border-emerald-500"
                      placeholder="50"
                    />
                    <select className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer">
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>

                {/* Predefined Amount Buttons */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setAmount(amt)
                        setCustomAmount('')
                      }}
                      className={`py-3 rounded-xl text-sm font-semibold transition ${
                        amount === amt && !customAmount
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                {/* Donate Anonymously Checkbox */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Donate Anonymously</span>
                  </label>
                </div>

                {/* Donor Name Input */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Adam Cooper Jr."
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Terms Agreement */}
                <div className="mb-8">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">I Agree To The Terms</span>
                  </label>
                </div>

                {/* Donate and QR Code Buttons */}
                <div className="flex gap-4 mb-6">
                  <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-base font-semibold rounded-xl">
                    DONATE
                  </Button>
                  <Button variant="outline" className="px-6 py-6 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold">
                    USE QR CODE
                  </Button>
                </div>

                {/* Trouble with Payment Link */}
                <div className="text-center">
                  <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition">
                    TROUBLE WITH PAYMENT?
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}