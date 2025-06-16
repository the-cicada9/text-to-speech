'use client';

import { useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { detectLanguage } from '@/utilites/langDetection'; 

const sherlockExcerpt = ` To Sherlock Holmes she is always the woman. I have seldom heard him
     mention her under any other name. In his eyes she eclipses and
     predominates the whole of her sex. It was not that he felt any
     emotion akin to love for Irene Adler. All emotions, and that one
     particularly, were abhorrent to his cold, precise but admirably
     balanced mind. He was, I take it, the most perfect reasoning and
     observing machine that the world has seen, but as a lover he would
     have placed himself in a false position. He never spoke of the softer
     passions, save with a gibe and a sneer. They were admirable things
     for the observer--excellent for drawing the veil from men's motives
     and actions. But for the trained reasoner to admit such intrusions
     into his own delicate and finely adjusted temperament was to
     introduce a distracting factor which might throw a doubt upon all his
     mental results. Grit in a sensitive instrument, or a crack in one of
     his own high-power lenses, would not be more disturbing than a strong
     emotion in a nature such as his. And yet there was but one woman to
     him, and that woman was the late Irene Adler, of dubious and
     questionable memory.

     I had seen little of Holmes lately. My marriage had drifted us away
     from each other. My own complete happiness, and the home-centred
     interests which rise up around the man who first finds himself master
     of his own establishment, were sufficient to absorb all my attention,
     while Holmes, who loathed every form of society with his whole
     Bohemian soul, remained in our lodgings in Baker Street, buried among
     his old books, and alternating from week to week between cocaine and
     ambition, the drowsiness of the drug, and the fierce energy of his
     own keen nature. He was still, as ever, deeply attracted by the study
     of crime, and occupied his immense faculties and extraordinary powers
     of observation in following out those clues, and clearing up those
     mysteries which had been abandoned as hopeless by the official
     police. From time to time I heard some vague account of his doings:
     of his summons to Odessa in the case of the Trepoff murder, of his
     clearing up of the singular tragedy of the Atkinson brothers at
     Trincomalee, and finally of the mission which he had accomplished so
     delicately and successfully for the reigning family of Holland.
     Beyond these signs of his activity, however, which I merely shared
     with all the readers of the daily press, I knew little of my former
     friend and companion.`; // Use full Sherlock text here

const sherlockExcerptSpanish = `Para Sherlock Holmes, ella es siempre la mujer. Rara vez lo he oído referirse a ella con otro nombre. 
A sus ojos, eclipsa y predomina sobre todo su sexo. No es que sintiera por Irene Adler una emoción parecida al amor. Todas las emociones, 
y especialmente esa, eran aborrecibles para su mente fría, precisa, pero admirablemente equilibrada. Era, según creo, la máquina de razonar 
y observar más perfecta que el mundo haya visto, pero como amante se habría colocado en una posición falsa. Nunca hablaba de las pasiones 
más suaves, salvo con burla y desprecio. Eran cosas admirables para el observador—excelentes para arrancar el velo de los motivos y acciones 
de los hombres. Pero para el razonador entrenado, admitir tales intrusiones en su propio temperamento delicado y finamente ajustado era introducir 
un factor perturbador que podía poner en duda todos sus resultados mentales. Un grano de arena en un instrumento sensible, o una grieta en una de 
sus propias lentes de gran aumento, no serían más perturbadores que una fuerte emoción en una naturaleza como la suya. Y sin embargo, para él solo 
hubo una mujer, y esa mujer fue la difunta Irene Adler, de memoria dudosa y cuestionable.

Últimamente había visto poco a Holmes. Mi matrimonio nos había distanciado. Mi propia felicidad completa y los intereses centrados en
el hogar que surgen en torno al hombre que por primera vez se ve dueño de su propia casa, eran suficientes para absorber toda mi 
atención, mientras que Holmes, quien aborrecía toda forma de sociedad con toda su alma bohemia, permanecía en nuestra residencia 
de Baker Street, sepultado entre sus viejos libros, y alternando semana a semana entre la cocaína y la ambición, entre la somnolencia 
de la droga y la energía feroz de su aguda naturaleza. Seguía, como siempre, profundamente atraído por el estudio del crimen, y 
ocupaba sus inmensas facultades y extraordinarios poderes de observación en seguir aquellas pistas y resolver aquellos misterios 
que habían sido abandonados como desesperados por la policía oficial. De vez en cuando oía algún vago relato de sus actividades: 
de su llamado a Odessa en el caso del asesinato Trepoff, de su esclarecimiento de la singular tragedia de los hermanos Atkinson 
en Trincomalee, y finalmente de la misión que había cumplido con tanta delicadeza y éxito para la familia reinante de Holanda. 
Más allá de estas señales de su actividad, que yo compartía con todos los lectores de la prensa diaria, sabía poco de mi antiguo amigo y compañero.`
const TextToSpeech = () => {
  const [text, setText] = useState(sherlockExcerptSpanish.trim());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const result = detectLanguage(text);  // Detect the language
  console.log(result);

  useEffect(() => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech on page load
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      console.log(allVoices , ">>>allvoices"); // Log all available voices
      
      setVoices(allVoices);
      if (allVoices.length > 0) setSelectedVoice(allVoices[4]);
    };

    if (typeof window !== 'undefined') {
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [result]);

  console.log(selectedVoice, ">>>selectedVoice");
  
  const handleTogglePlayPause = () => {
    if (!isSpeaking && !isPaused) {
      const newUtterance = new SpeechSynthesisUtterance(text);

      // Determine the language to speak based on detected language
      let languageToSpeak = 'en';  // Default to English
      if (result !== 'Unknown' && result !== 'und') {
        languageToSpeak = result; // Set to detected language
      }
      console.log(`Detected language: ${languageToSpeak}`);

      // Find the appropriate voice for the language
      const selectedVoiceForLang = voices.find((voice) => voice.lang.startsWith(languageToSpeak));
      if (selectedVoiceForLang) {
        newUtterance.voice = selectedVoiceForLang;
        newUtterance.lang = selectedVoiceForLang.lang;
      } else {
        newUtterance.lang = languageToSpeak; // Default to language code if no voice found
      }

      newUtterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      newUtterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setUtterance(null);
      };

      setUtterance(newUtterance);
      window.speechSynthesis.speak(newUtterance);
    } else if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📰 Sherlock Holmes News</h1>
        <button
          onClick={handleTogglePlayPause}
          className={`${isSpeaking ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white p-2 rounded-full transition duration-200`}
          title={isSpeaking && !isPaused ? 'Pause' : 'Play'}
        >
          {isSpeaking && !isPaused ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
      {/* <div className="flex flex-col sm:flex-row gap-4 items-center">
        <label className="text-sm font-medium">Voice:</label>
        <select
          className="border p-2 rounded flex-1"
          value={selectedVoice?.name}
          onChange={(e) => {
            const voice = voices.find((v) => v.name === e.target.value);
            setSelectedVoice(voice || null);
          }}
        >
          {voices.map((voice, i) => (
            <option key={i} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div> */}
      <div className="">
        {text}
      </div>
    </div>
  );
};

export default TextToSpeech;
