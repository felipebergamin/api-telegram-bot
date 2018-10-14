import { InputMediaAnimation } from "./InputMediaAnimation";
import { InputMediaAudio } from "./InputMediaAudio";
import { InputMediaDocument } from "./InputMediaDocument";
import { InputMediaPhoto } from "./InputMediaPhoto";
import { InputMediaVideo } from "./InputMediaVideo";

export interface InputMedia
    extends InputMediaPhoto, InputMediaVideo, InputMediaAnimation, InputMediaAudio, InputMediaDocument {}
