import sharp from 'sharp';

const compressTexture = (ifile: string, ofile: string, quality: number) => {
  return sharp(ifile)
    .pipelineColourspace('srgb')
    .toColourspace('srgb')
    .resize(1024)
    .jpeg({
      quality: quality,
      progressive: true,
      chromaSubsampling: '4:4:4',
      optimiseCoding: true,
      quantisationTable: 4,
      trellisQuantisation: false,
      overshootDeringing: true,
      optimiseScans: true,
      force: true,
    })
    .toFile(ofile);
};

const multiplyTexture = async (albedo: string, ao: string, pmaaao: string) => {
  return sharp(albedo)
    .pipelineColorspace('linear')
    .composite([
      {
        input: await sharp(ao)
          .pipelineColourspace('srgb')
          .toColourspace('srgb')
          .toBuffer(),
        blend: 'multiply',
        gravity: 'center',
      },
    ])
    .jpeg({
      quality: 100,
      progressive: false,
      chromaSubsampling: '4:4:4',
      optimiseCoding: true,
      quantisationTable: 4,
      trellisQuantisation: false,
      overshootDeringing: true,
      optimiseScans: true,
    })
    .toFile(pmaaao);
};

const albedoFile: string = 'assets/albedo.jpg';
const aoFile: string = 'assets/ao.jpg';
const normalFile: string = 'assets/normal.jpg';
const roughnessFile: string = 'assets/roughness.jpg';
const metalnessFile: string = 'assets/metalness.jpg';
const pmaaaoFile: string = 'assets/pmaaao.jpg';

const albedoCompressedFile: string = 'assets/albedo_compressed.jpg';
const aoCompressedFile: string = 'assets/ao_compressed.jpg';
const normalCompressedFile: string = 'assets/normal_compressed.jpg';
const roughnessCompressedFile: string = 'assets/roughness_compressed.jpg';
const metalnessCompressedFile: string = 'assets/metalness_compressed.jpg';
const pmaaoCompressedFile: string = 'assets/pmaaao_compressed.jpg';

const hasAlbedo: boolean = true;
const hasAO: boolean = true;
const hasNormal: boolean = true;
const hasRoughness: boolean = true;
const hasMetalness: boolean = false;

if (hasAlbedo) compressTexture(albedoFile, albedoCompressedFile, 70);
if (hasNormal) compressTexture(normalFile, normalCompressedFile, 90);
if (hasRoughness) compressTexture(roughnessFile, roughnessCompressedFile, 60);
if (hasMetalness) compressTexture(metalnessFile, metalnessCompressedFile, 60);
if (hasAO) compressTexture(aoFile, aoCompressedFile, 60);
if (hasAlbedo && hasAO) {
  multiplyTexture(albedoFile, aoFile, pmaaaoFile).then(() =>
    compressTexture(pmaaaoFile, pmaaoCompressedFile, 70),
  );
}

console.log('Done');
