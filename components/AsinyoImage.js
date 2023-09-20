import Image from "next/image";

const loader = ({ src, width, quality }) => {
  return `${src}?q=${quality || 100}`;
};

export default function AsinyoImage(props) {
  return <Image loader={loader} blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPUcDd5BQAC0QGPn49GEgAAAABJRU5ErkJggg==" placeholder="blur"   priority={true} alt='' {...props}/>;
}
