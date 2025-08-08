const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, 'src/environments/environment.ts');

const envConfigFile = `export const environment = {
  production: true,
  supabaseUrl: '${process.env['SUPABASE_URL']}',
  supabaseKey: '${process.env['SUPABASE_KEY']}',
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Successfully generated environment.ts`);
});
