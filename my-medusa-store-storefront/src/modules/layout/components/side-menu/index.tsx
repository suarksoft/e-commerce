"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { HttpTypes } from "@medusajs/types"

const SideMenuItems = {
  Anasayfa: { href: "/", icon: "🏠" },
  Mağaza: { href: "/store", icon: "🛍️" },
  Hesabım: { href: "/account", icon: "👤" },
  Sepetim: { href: "/cart", icon: "🛒" },
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center px-4 py-2 rounded-full transition-all ease-out duration-300 focus:outline-none hover:bg-gradient-to-r hover:from-rose-100 hover:to-orange-100 hover:text-rose-700 group"
                >
                  <span className="text-sm font-medium">Menü</span>
                  <div className="ml-2 w-6 h-6 flex flex-col justify-center items-center space-y-1 group-hover:space-y-1.5 transition-all duration-300">
                    <div className="w-4 h-0.5 bg-current rounded-full transform group-hover:rotate-45 group-hover:translate-y-1.5 transition-all duration-300"></div>
                    <div className="w-4 h-0.5 bg-current rounded-full group-hover:opacity-0 transition-all duration-300"></div>
                    <div className="w-4 h-0.5 bg-current rounded-full transform group-hover:-rotate-45 group-hover:-translate-y-1.5 transition-all duration-300"></div>
                  </div>
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100 backdrop-blur-2xl"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 scale-100 backdrop-blur-2xl"
                leaveTo="opacity-0 scale-95"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm m-2 backdrop-blur-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-gradient-to-br from-white/95 via-rose-50/90 to-orange-50/95 backdrop-blur-xl rounded-3xl justify-between p-8 shadow-2xl border border-white/20"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                          Moda Es Es
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Tarzınızı keşfedin</p>
                      </div>
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 group"
                      >
                        <XMark className="w-5 h-5 text-gray-600 group-hover:text-rose-600 transition-colors duration-300" />
                      </button>
                    </div>

                    {/* Menu Items */}
                    <ul className="flex flex-col gap-4 items-start justify-start flex-1">
                      {Object.entries(SideMenuItems).map(([name, { href, icon }], index) => {
                        return (
                          <li key={name} className="w-full">
                            <LocalizedClientLink
                              href={href}
                              className="group flex items-center w-full p-4 rounded-2xl hover:bg-gradient-to-r hover:from-rose-100 hover:to-orange-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                              style={{
                                animationDelay: `${index * 100}ms`,
                              }}
                            >
                              <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                                {icon}
                              </span>
                              <span className="text-xl font-semibold text-gray-800 group-hover:text-rose-700 transition-colors duration-300">
                                {name}
                              </span>
                              <ArrowRightMini className="ml-auto w-5 h-5 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-2 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 right-8 w-20 h-20 bg-gradient-to-br from-rose-200 to-orange-200 rounded-full opacity-20 blur-xl"></div>
                    <div className="absolute bottom-32 left-8 w-16 h-16 bg-gradient-to-br from-amber-200 to-rose-200 rounded-full opacity-20 blur-xl"></div>

                    {/* Footer */}
                    <div className="flex flex-col gap-y-4 pt-8 border-t border-rose-200/50">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-400 to-orange-400 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">ME</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-rose-200 to-orange-200"></div>
                      </div>

                      <Text className="text-center text-sm text-gray-600 leading-relaxed">
                        © {new Date().getFullYear()} Moda Es Es
                        <br />
                        <span className="text-xs text-gray-500">Bütün hakları saklıdır.</span>
                      </Text>

                      <div className="flex justify-center gap-2 mt-2">
                        <div className="w-2 h-2 rounded-full bg-rose-300"></div>
                        <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                        <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
