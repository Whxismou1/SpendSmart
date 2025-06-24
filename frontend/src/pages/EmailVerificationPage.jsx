import { AlertCircle, Check, Loader2, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/authService";
const MAX_DIGITS = 5;

export default function EmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const inputRefs = useRef([])
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    const verificationCode = code.join("")
    
    if (verificationCode.length !== 6) {
      setError("Por favor ingresa el código completo")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      await verifyEmail(verificationCode)
      setIsSuccess(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleOnChange = (index, value) => {
    const newCode = [...code]
    
    if (value.length > 1) {
      // Manejar pegado de código
      const codePasted = value.slice(0, 6).split("")
      for (let i = 0; i < 6; i++) {
        newCode[i] = codePasted[i] || ""
      }
      setCode(newCode)
      const lastFilledInput = newCode.findLastIndex((digit) => digit !== "")
      const focusIndex = lastFilledInput < MAX_DIGITS ? lastFilledInput + 1 : MAX_DIGITS
      inputRefs.current[focusIndex]?.focus()
    } else {
      newCode[index] = value
      setCode(newCode)
      if (index < MAX_DIGITS && value) {
        inputRefs.current[index + 1]?.focus()
      }
    }
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("")
  }

  const handleOnKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleGoToDashboard = () => {
    navigate("/login")
  }

  const handleResendCode = () => {
    // Reset form
    setCode(["", "", "", "", "", ""])
    setError("")
    setIsSuccess(false)
    setIsVerifying(false)
    inputRefs.current[0]?.focus()
  }

  // Auto-submit cuando se complete el código
  useEffect(() => {
    if (code.every((digit) => digit !== "") && !isVerifying && !isSuccess) {
      handleSubmit(new Event("submit"))
    }
  }, [code, isVerifying, isSuccess])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* <div className="mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al inicio</span>
          </button>
        </div> */}

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="text-center">
            {isSuccess ? (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">¡Correo verificado!</h2>
                <p className="text-gray-300 mb-6">
                  Tu dirección de correo electrónico ha sido verificada correctamente. Ya puedes acceder a todas las
                  funciones de Spend Smart.
                </p>
                <button
                  onClick={handleGoToDashboard}
                  className="inline-block py-3 px-6 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg text-white font-medium hover:from-emerald-600 hover:to-blue-700 transition-all"
                >
                  Ir al Login
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Verifica tu correo electrónico</h2>
                <p className="text-gray-300 mb-8">
                  Hemos enviado un código de 6 dígitos a tu correo electrónico. Ingresa el código para continuar.
                </p>

                <div className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength="6"
                        value={digit}
                        onChange={(e) => handleOnChange(index, e.target.value)}
                        onKeyDown={(e) => handleOnKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-semibold bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        disabled={isVerifying}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isVerifying || code.some(digit => digit === "")}
                      className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg text-white font-medium hover:from-emerald-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        "Verificar código"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
                      disabled={isVerifying}
                    >
                      ¿No recibiste el código? Reenviar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}