/**
 * このファイルではhandlebarsテンプレートを使用してコードを生成する関数を定義する。
 * メタデータはmetadataフォルダ配下にJSON形式で保存されており、
 * テンプレートはtemplatesフォルダ配下に保存されている。
 * 生成されたコードはsrcフォルダ配下に保存される。
 */

import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';

async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return files.flat();
}


/**
 * metadata/dynamic配下からmetadataNameで指定されたメタデータファイルを読み込み、
 * templates/dynamic配下のファイルを列挙し、メタデータを適用してコードを生成する。
 * 生成されたコードはsrc/dynamic配下に保存する。
 * コードの生成にはgenerateCodeFromMetadata関数を使用する。
 */
export async function generateDynamicCode() {
    const metadataDir = 'metadata/dynamic';
    const outputDir = 'src/dynamic';
    const dirents = await fs.readdir(metadataDir, { withFileTypes: true });
    for (const dirent of dirents) {
        if (dirent.isFile() && path.extname(dirent.name) === '.json') {
            const metadataFilePath = path.join(metadataDir, dirent.name);
            await generateCodeFromMetadata(metadataFilePath, outputDir);
        }
    }
}

/**
 * metadata/static配下からmetadataNameで指定されたメタデータファイルを読み込み、
 * templates/static配下のファイルを列挙し、メタデータを適用してコードを生成する。
 * 生成されたコードはgenerated配下に保存する。
 * コードの生成にはgenerateCodeFromMetadata関数を使用する。
 */
export async function generateStaticCode(metadataName){
    const metadataFilePath = path.join('metadata/static', `${metadataName}.json`);
    const outputDirectory = 'generated';
    await generateCodeFromMetadata(metadataFilePath, outputDirectory);
}


/**
 * metadataフォルダを起点として引数で指定されたメタデータファイルを読み込む。
 * templatesフォルダ配下のファイルを列挙し、メタデータを適用してコードを生成する。
 * 生成されたコードは引数で指定された出力先フォルダを起点として、templatesフォルダ配下の構造を保ったまま保存する。
 * コードの生成にはgenerateCodeWithTemplate関数を使用する。い
 */
async function generateCodeFromMetadata(metadataFilePath, outputDirectory) {
    const metadata = JSON.parse(await fs.readFile(metadataFilePath, 'utf-8'));
    const templateBaseDir = path.dirname(metadataFilePath).replace('metadata', 'templates');

    const templateFiles = await getFiles(templateBaseDir);

    for (const templatePath of templateFiles) {
        await generateCodeWithTemplate(metadata, templatePath, templateBaseDir, outputDirectory);
    }
}

/**
 * templatePathで指定されたテンプレートファイルを読み込み、metadataの内容を適用してコードを生成する。
 * 生成されたコードはoutputDirectoryを起点としてtemplatePathと同じ構造で保存する。
 */
async function generateCodeWithTemplate(metadata, templatePath, templateBaseDir, outputDirectory) {
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    const generatedCode = template(metadata);

    const relativePath = path.relative(templateBaseDir, templatePath);
    const outputPath = path.join(outputDirectory, relativePath).replace(/\.hbs$/, '');

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, generatedCode);
}