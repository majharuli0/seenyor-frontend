import axios from 'axios';

const translateTo = async (data, targetLang = 'en') => {
  try {
    const response = await axios.post(
      'https://libretranslate.com/translate', // Use LibreTranslate API
      {
        q: data,
        source: 'auto', // Automatically detect the language
        target: targetLang,
        format: 'text',
      }
    );
    console.log(response.translatedText);

    return response.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return data; // Return original data if translation fails
  }
};

export default translateTo;
