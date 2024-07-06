import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        const fileType = file.mimetype.split('/')[0]

        if (fileType === 'image'){
            cb(null,'public/images/')
        }
        else {
        cb(new Error("Invalid File Type"))
        }
            
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
})
const upload = multer({storage: storage})

export default upload;