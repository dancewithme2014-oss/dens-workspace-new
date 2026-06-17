export default function LoopingVideo({ className, src }: { className?: string; src: string }) {
  return <video
    className={`${className ?? ""} seamless-video`}
    src={src}
    autoPlay
    muted
    playsInline
    preload="metadata"
  />;
}
