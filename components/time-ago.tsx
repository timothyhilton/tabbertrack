"use client"

import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from "react-time-ago";

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

export default function TimeAgoWrapper({ date }: { date: Date }){
    return <ReactTimeAgo date={date} locale="en-US" timeStyle="twitter"/>
}