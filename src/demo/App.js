import React from 'react'
import { Devslab } from '../lib'

const demoProps = {
  themeColor: '#1078ff',
  locale: "en_US",
  environment: process.env.NODE_ENV !== 'production' ? 'ucdev' : null,
  authId: "1",
  apiKey: "E3cWLx1LysjCufHJ4uJrVo32zM3420T3",
  templatesAccount: 'bestcrm',
  userId: "1",
  avatar_url: "https://i.imgur.com/gGThjLm.jpg"
}

const App = () => (
  <Devslab {...demoProps} />
)
//
export default App
