"use client"

import { useState, useRef } from "react"
import { Headphones, Info, Check, X, Volume2, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export default function FrenchGrammarPage() {
  // State for form inputs and validation
  const [formState, setFormState] = useState({
    exercise1: { selected: null, isCorrect: null },
    exercise2: { answer1: "", answer2: "", isCorrect: null },
    exercise3: { answer1: "", answer2: "", answer3: "", isCorrect: null },
    exercise4: { selected: null, isCorrect: null },
    exercise5: { selected: null, isCorrect: null },
  })

  // State for progress tracking
  const [progress, setProgress] = useState(0)
  const [completedExercises, setCompletedExercises] = useState(0)

  // State for audio playback
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // State for tooltips and dialogs
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  const { toast } = useToast()

  // Handle audio playback
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle form input changes
  const handleInputChange = (exercise: string, field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise as keyof typeof prev],
        [field]: value,
        isCorrect: null,
      },
    }))
  }

  // Handle radio/checkbox selection
  const handleSelection = (exercise: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise as keyof typeof prev],
        selected: value,
        isCorrect: null,
      },
    }))
  }

  // Validate exercise answers
  const validateExercise = (exercise: string) => {
    let isCorrect = false

    switch (exercise) {
      case "exercise1":
        isCorrect = formState.exercise1.selected === "option1"
        break
      case "exercise2":
        isCorrect =
          formState.exercise2.answer1.toLowerCase() === "délicieux" &&
          formState.exercise2.answer2.toLowerCase() === "du"
        break
      case "exercise3":
        isCorrect =
          formState.exercise3.answer1.toLowerCase() === "des" &&
          formState.exercise3.answer2.toLowerCase() === "de" &&
          formState.exercise3.answer3.toLowerCase() === "pas des"
        break
      case "exercise4":
        isCorrect = formState.exercise4.selected === "option1"
        break
      case "exercise5":
        isCorrect = formState.exercise5.selected === "option1"
        break
    }

    setFormState((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise as keyof typeof prev],
        isCorrect,
      },
    }))

    // Update progress
    if (isCorrect && formState[exercise as keyof typeof formState].isCorrect !== true) {
      const newCompleted = completedExercises + 1
      setCompletedExercises(newCompleted)
      setProgress(Math.round((newCompleted / 5) * 100))

      if (newCompleted === 5) {
        toast({
          title: "Félicitations!",
          description: "Vous avez complété tous les exercices!",
          duration: 5000,
        })
      } else {
        toast({
          title: "Correct!",
          description: "Bonne réponse!",
          duration: 3000,
        })
      }
    } else if (!isCorrect) {
      toast({
        title: "Essayez encore",
        description: "Votre réponse n'est pas correcte.",
        variant: "destructive",
        duration: 3000,
      })
    }

    return isCorrect
  }

  // Grammar explanations for tooltips
  const grammarExplanations = {
    definiteArticle:
      "Les articles définis (le, la, les) sont utilisés quand on parle de quelque chose de spécifique ou déjà mentionné.",
    indefiniteArticle:
      "Les articles indéfinis (un, une, des) sont utilisés quand on parle de quelque chose de général ou mentionné pour la première fois.",
    partitiveArticle:
      "Les articles partitifs (du, de la, des) sont utilisés pour indiquer une partie d'un tout ou une quantité indéterminée.",
    negation: "Dans la négation, 'de' remplace souvent 'du', 'de la', et 'des'.",
  }

  return (
    <div className="max-w-4xl mx-auto p-4 font-serif">
      {/* Audio element */}
      <audio ref={audioRef} src="/audio-placeholder.mp3" onEnded={() => setIsPlaying(false)} />

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Votre progrès</h2>
          <span className="text-sm">{completedExercises}/5 exercices complétés</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="border-2 border-rose-400 rounded-lg overflow-hidden relative">
        {/* Blue sidebar */}
        <div className="absolute left-0 top-32 w-14 h-32 bg-blue-600 text-white flex flex-col items-center justify-center text-xs rotate-180 writing-mode-vertical">
          <span className="transform rotate-180">ESPACE</span>
          <span className="transform rotate-180">DES ARTICLES</span>
        </div>

        {/* Main content */}
        <div className="ml-14">
          {/* Number 2 in circle */}
          <motion.div
            className="flex justify-center -mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-rose-400 text-white flex items-center justify-center text-4xl font-bold z-10">
              2
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="text-center pt-12 pb-2 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl text-rose-500 font-medium mb-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dotted border-rose-300">
                      le, la, les, un, une, des, du, de la
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Les articles en français: définis, indéfinis et partitifs</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h1>
            <p className="text-rose-400 italic text-xl">On va servir du riz avec le poisson?</p>
          </motion.div>

          {/* Observez section */}
          <div className="mt-6 px-4">
            <div className="bg-yellow-100 py-1 px-4 inline-block">
              <span className="font-bold">OBSERVEZ</span>
            </div>
            <div className="flex items-center ml-4 text-gray-400">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600"
                onClick={toggleAudio}
              >
                {isPlaying ? <Volume2 className="h-6 w-6 animate-pulse" /> : <Headphones className="h-6 w-6" />}
                <span>PISTE 5</span>
              </Button>
            </div>

            {/* Comic strip */}
            <div className="mt-4 border-2 border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First conversation */}
                <motion.div
                  className="border border-gray-300 rounded-lg p-3 relative hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <p className="italic text-center mb-2">Les clients ont commandé une entrée?</p>
                  <div className="bg-gray-100 rounded-lg p-2 mb-2 hover:bg-gray-200 transition-colors">
                    <p className="italic">Non, ils n&apos;aiment pas la soupe.</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 mb-2 hover:bg-gray-200 transition-colors">
                    <p className="italic">Ils veulent de la sauce avec le poisson?</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors">
                    <p className="italic">Oui bien sûr, la sauce que tu as préparée.</p>
                  </div>
                </motion.div>

                {/* Second conversation */}
                <motion.div
                  className="border border-gray-300 rounded-lg p-3 relative hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <p className="italic text-center mb-2">On va servir du riz avec le poisson?</p>
                  <div className="bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors">
                    <p className="italic">Oui, nous avons un riz délicieux qui vient de Thaïlande.</p>
                  </div>
                </motion.div>

                {/* Third conversation */}
                <motion.div
                  className="border border-gray-300 rounded-lg p-3 relative hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <p className="italic text-center mb-2">J&apos;ai prévu des cerises pour décorer le gâteau.</p>
                  <div className="bg-gray-100 rounded-lg p-2 mb-2 hover:bg-gray-200 transition-colors">
                    <p className="italic">Je n&apos;ai pas trouvé de cerises.</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors">
                    <p className="italic">Ah oui, ce ne sont pas des cerises, ce sont des prunes!</p>
                  </div>
                </motion.div>

                {/* Fourth conversation */}
                <motion.div
                  className="border border-gray-300 rounded-lg p-3 relative hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <p className="italic text-center mb-2">
                    Les clients ne veulent pas du poulet mais de la viande de bœuf.
                  </p>
                  <div className="bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors">
                    <p className="italic">Je ne veux pas un concombre, je veux une courgette.</p>
                  </div>
                </motion.div>

                {/* Fifth conversation */}
                <motion.div
                  className="border border-gray-300 rounded-lg p-3 relative md:col-span-2 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold">
                    5
                  </div>
                  <p className="italic text-center mb-2">
                    Ici, nous cuisinons des légumes frais. Le chef veut que les clients mangent de bons légumes.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Réfléchissez section */}
          <div className="mt-6 px-4 pb-8">
            <div className="bg-yellow-100 py-1 px-4 inline-block">
              <span className="font-bold">RÉFLÉCHISSEZ</span>
            </div>

            {/* Exercise 1 */}
            <div className="mt-4">
              <div className="flex items-center">
                <p className="font-bold">
                  1. Associez.{" "}
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-400 text-white font-bold">
                    1
                  </span>
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Info className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Les Articles en Français</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <p>
                        <strong>Articles définis:</strong> le, la, les
                      </p>
                      <p>
                        <strong>Articles indéfinis:</strong> un, une, des
                      </p>
                      <p>
                        <strong>Articles partitifs:</strong> du, de la, des
                      </p>
                      <p>
                        Les articles définis sont utilisés pour parler de quelque chose de spécifique ou déjà mentionné.
                      </p>
                      <p>
                        Les articles indéfinis sont utilisés pour parler de quelque chose de général ou mentionné pour
                        la première fois.
                      </p>
                      <p>
                        Les articles partitifs sont utilisés pour indiquer une partie d'un tout ou une quantité
                        indéterminée.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="ex1-option1"
                      name="exercise1"
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onChange={() => handleSelection("exercise1", "option1")}
                      checked={formState.exercise1.selected === "option1"}
                    />
                    <label htmlFor="ex1-option1" className="italic cursor-pointer">
                      une entrée ○
                    </label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="ex1-option2"
                      name="exercise1"
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onChange={() => handleSelection("exercise1", "option2")}
                      checked={formState.exercise1.selected === "option2"}
                    />
                    <label htmlFor="ex1-option2" className="italic cursor-pointer">
                      de la sauce ○
                    </label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="ex1-option3"
                      name="exercise1"
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onChange={() => handleSelection("exercise1", "option3")}
                      checked={formState.exercise1.selected === "option3"}
                    />
                    <label htmlFor="ex1-option3" className="italic cursor-pointer">
                      la soupe ○
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="ex1-option4"
                      name="exercise1"
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onChange={() => handleSelection("exercise1", "option4")}
                      checked={formState.exercise1.selected === "option4"}
                    />
                    <label htmlFor="ex1-option4" className="italic cursor-pointer">
                      la sauce que j&apos;ai préparée ○
                    </label>
                  </div>
                </div>
                <div>
                  <p>○ On peut compter la quantité (une, deux, trois...).</p>
                  <p>○ On ne peut pas compter la quantité.</p>
                  <p>○ Le nom est général.</p>
                  <p>○ Le nom est précisé.</p>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={() => validateExercise("exercise1")}
                  className="bg-rose-400 hover:bg-rose-500 text-white"
                >
                  Vérifier
                </Button>
              </div>
              <AnimatePresence>
                {formState.exercise1.isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-2 p-2 rounded-md ${formState.exercise1.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    <div className="flex items-center">
                      {formState.exercise1.isCorrect ? (
                        <Check className="h-5 w-5 mr-2" />
                      ) : (
                        <X className="h-5 w-5 mr-2" />
                      )}
                      <p>
                        {formState.exercise1.isCorrect
                          ? "Correct! 'Une entrée' utilise l'article indéfini car on peut compter la quantité."
                          : "Essayez encore. Pensez à ce qu'on peut compter."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Exercise 2 */}
            <div className="mt-6">
              <p className="font-bold">
                2. Écrivez.{" "}
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-400 text-white font-bold">
                  2
                </span>
              </p>
              <div className="mt-2">
                <p>
                  Dans la réponse, quel est le mot placé après riz?{" "}
                  <input
                    type="text"
                    className="border-b border-gray-400 w-64 inline-block focus:outline-none focus:border-rose-400 px-1"
                    value={formState.exercise2.answer1}
                    onChange={(e) => handleInputChange("exercise2", "answer1", e.target.value)}
                  />
                </p>
                <p className="mt-2">
                  La présence de ce mot oblige à utiliser quel article?{" "}
                  <input
                    type="text"
                    className="border-b border-gray-400 w-64 inline-block focus:outline-none focus:border-rose-400 px-1"
                    value={formState.exercise2.answer2}
                    onChange={(e) => handleInputChange("exercise2", "answer2", e.target.value)}
                  />
                </p>
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={() => validateExercise("exercise2")}
                  className="bg-rose-400 hover:bg-rose-500 text-white"
                >
                  Vérifier
                </Button>
              </div>
              <AnimatePresence>
                {formState.exercise2.isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-2 p-2 rounded-md ${formState.exercise2.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    <div className="flex items-center">
                      {formState.exercise2.isCorrect ? (
                        <Check className="h-5 w-5 mr-2" />
                      ) : (
                        <X className="h-5 w-5 mr-2" />
                      )}
                      <p>
                        {formState.exercise2.isCorrect
                          ? "Correct! Le mot 'délicieux' après 'riz' oblige à utiliser l'article partitif 'du'."
                          : "Essayez encore. Regardez la phrase 'Oui, nous avons un riz délicieux qui vient de Thaïlande.'"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Exercise 3 */}
            <div className="mt-6">
              <p className="font-bold">
                3. Écrivez.{" "}
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-400 text-white font-bold">
                  3
                </span>
              </p>
              <div className="mt-2">
                <p>
                  Quel article est utilisé dans la phrase affirmative?{" "}
                  <input
                    type="text"
                    className="border-b border-gray-400 w-24 inline-block focus:outline-none focus:border-rose-400 px-1"
                    value={formState.exercise3.answer1}
                    onChange={(e) => handleInputChange("exercise3", "answer1", e.target.value)}
                  />
                  et dans la phrase négative?{" "}
                  <input
                    type="text"
                    className="border-b border-gray-400 w-24 inline-block focus:outline-none focus:border-rose-400 px-1"
                    value={formState.exercise3.answer2}
                    onChange={(e) => handleInputChange("exercise3", "answer2", e.target.value)}
                  />
                </p>
                <p className="mt-2">
                  À la forme négative, avec le verbe être, quel est l&apos;article utilisé?{" "}
                  <input
                    type="text"
                    className="border-b border-gray-400 w-64 inline-block focus:outline-none focus:border-rose-400 px-1"
                    value={formState.exercise3.answer3}
                    onChange={(e) => handleInputChange("exercise3", "answer3", e.target.value)}
                  />
                </p>
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={() => validateExercise("exercise3")}
                  className="bg-rose-400 hover:bg-rose-500 text-white"
                >
                  Vérifier
                </Button>
              </div>
              <AnimatePresence>
                {formState.exercise3.isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-2 p-2 rounded-md ${formState.exercise3.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    <div className="flex items-center">
                      {formState.exercise3.isCorrect ? (
                        <Check className="h-5 w-5 mr-2" />
                      ) : (
                        <X className="h-5 w-5 mr-2" />
                      )}
                      <p>
                        {formState.exercise3.isCorrect
                          ? "Correct! Dans la phrase affirmative on utilise 'des', dans la négative 'de', et avec être négatif 'pas des'."
                          : "Essayez encore. Regardez la phrase 'J'ai prévu des cerises' et 'Je n'ai pas trouvé de cerises'."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Exercise 4 */}
            <div className="mt-6">
              <p className="font-bold">
                4. Cochez.{" "}
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-400 text-white font-bold">
                  4
                </span>
              </p>
              <p>Quand on oppose deux éléments dans une phrase négative,</p>
              <div className="flex items-center mt-1">
                <input
                  type="radio"
                  id="ex4-option1"
                  name="exercise4"
                  className="mr-2 h-4 w-4 cursor-pointer"
                  onChange={() => handleSelection("exercise4", "option1")}
                  checked={formState.exercise4.selected === "option1"}
                />
                <label htmlFor="ex4-option1" className="cursor-pointer">
                  on utilise l&apos;article de.
                </label>
              </div>
              <div className="flex items-center mt-1">
                <input
                  type="radio"
                  id="ex4-option2"
                  name="exercise4"
                  className="mr-2 h-4 w-4 cursor-pointer"
                  onChange={() => handleSelection("exercise4", "option2")}
                  checked={formState.exercise4.selected === "option2"}
                />
                <label htmlFor="ex4-option2" className="cursor-pointer">
                  on utilise l&apos;article indéfini (un, une, des) ou l&apos;article partitif (du, de la).
                </label>
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={() => validateExercise("exercise4")}
                  className="bg-rose-400 hover:bg-rose-500 text-white"
                >
                  Vérifier
                </Button>
              </div>
              <AnimatePresence>
                {formState.exercise4.isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-2 p-2 rounded-md ${formState.exercise4.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    <div className="flex items-center">
                      {formState.exercise4.isCorrect ? (
                        <Check className="h-5 w-5 mr-2" />
                      ) : (
                        <X className="h-5 w-5 mr-2" />
                      )}
                      <p>
                        {formState.exercise4.isCorrect
                          ? "Correct! Dans une phrase négative avec opposition, on utilise l'article 'de'."
                          : "Essayez encore. Regardez la phrase 'Les clients ne veulent pas du poulet mais de la viande de bœuf.'"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Exercise 5 */}
            <div className="mt-6">
              <p className="font-bold">
                5. Associez.{" "}
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-400 text-white font-bold">
                  5
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="ex5-option1"
                      name="exercise5"
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onChange={() => handleSelection("exercise5", "option1")}
                      checked={formState.exercise5.selected === "option1"}
                    />
                    <label htmlFor="ex5-option1" className="cursor-pointer">
                      On emploie des ○
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="ex5-option2"
                      name="exercise5"
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onChange={() => handleSelection("exercise5", "option2")}
                      checked={formState.exercise5.selected === "option2"}
                    />
                    <label htmlFor="ex5-option2" className="cursor-pointer">
                      On emploie de ○
                    </label>
                  </div>
                </div>
                <div>
                  <p>○ quand l&apos;adjectif est placé après le nom pluriel.</p>
                  <p>○ quand l&apos;adjectif est placé avant le nom pluriel.</p>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={() => validateExercise("exercise5")}
                  className="bg-rose-400 hover:bg-rose-500 text-white"
                >
                  Vérifier
                </Button>
              </div>
              <AnimatePresence>
                {formState.exercise5.isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-2 p-2 rounded-md ${formState.exercise5.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    <div className="flex items-center">
                      {formState.exercise5.isCorrect ? (
                        <Check className="h-5 w-5 mr-2" />
                      ) : (
                        <X className="h-5 w-5 mr-2" />
                      )}
                      <p>
                        {formState.exercise5.isCorrect
                          ? "Correct! On emploie 'des' quand l'adjectif est placé après le nom pluriel."
                          : "Essayez encore. Regardez la phrase 'Ici, nous cuisinons des légumes frais.'"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Completion badge */}
          <AnimatePresence>
            {progress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center mb-6"
              >
                <div className="bg-green-100 text-green-800 rounded-lg p-4 flex items-center gap-3 shadow-md">
                  <Award className="h-8 w-8" />
                  <div>
                    <h3 className="font-bold">Félicitations!</h3>
                    <p>Vous avez complété tous les exercices avec succès!</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page number */}
          <div className="text-center pb-4 text-gray-500">
            <p>14</p>
            <p className="uppercase text-xs">Les déterminants</p>
          </div>
        </div>
      </div>

      {/* Help button */}
      <div className="fixed bottom-4 right-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full w-12 h-12 bg-rose-400 hover:bg-rose-500 text-white shadow-lg">
              <span className="text-xl font-bold">?</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aide - Les Articles en Français</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <h3 className="font-bold">Articles définis</h3>
              <p>
                <strong>le</strong> (masculin singulier): le livre, le poisson
              </p>
              <p>
                <strong>la</strong> (féminin singulier): la table, la sauce
              </p>
              <p>
                <strong>les</strong> (pluriel): les livres, les tables
              </p>

              <h3 className="font-bold">Articles indéfinis</h3>
              <p>
                <strong>un</strong> (masculin singulier): un livre, un poisson
              </p>
              <p>
                <strong>une</strong> (féminin singulier): une table, une sauce
              </p>
              <p>
                <strong>des</strong> (pluriel): des livres, des tables
              </p>

              <h3 className="font-bold">Articles partitifs</h3>
              <p>
                <strong>du</strong> (masculin singulier): du pain, du riz
              </p>
              <p>
                <strong>de la</strong> (féminin singulier): de la sauce, de la viande
              </p>
              <p>
                <strong>des</strong> (pluriel): des légumes, des fruits
              </p>

              <h3 className="font-bold">Négation</h3>
              <p>
                Dans la négation, les articles indéfinis et partitifs deviennent généralement <strong>de</strong>:
              </p>
              <p>
                J'ai <strong>des</strong> cerises → Je n'ai pas <strong>de</strong> cerises
              </p>
              <p>
                Je mange <strong>du</strong> pain → Je ne mange pas <strong>de</strong> pain
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
